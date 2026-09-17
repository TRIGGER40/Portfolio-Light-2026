import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { getSupabaseConfig, supabaseHeaders } from './_supabase.js';
import { getGoogleAccessToken } from './_google.js';
import { sendRefundEmail } from './_refundEmail.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = (req.body ?? {}) as { id?: string };
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey) return res.status(503).json({ error: 'Bookings store not configured' });

  try {
    // 1. Look up the booking's calendar event id + payment/contact details
    const lookupRes = await fetch(
      `${url}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}&select=calendar_event_id,razorpay_payment_id,name,email,date,slot`,
      { headers: supabaseHeaders(serviceKey) },
    );
    const rows = lookupRes.ok
      ? await lookupRes.json() as {
          calendar_event_id?: string; razorpay_payment_id?: string;
          name?: string; email?: string; date?: string; slot?: string;
        }[]
      : [];
    const booking = rows[0];
    const calendarEventId   = booking?.calendar_event_id;
    const razorpayPaymentId = booking?.razorpay_payment_id;

    // 2. Delete the Google Calendar event — this is what actually frees the slot,
    //    since availability is computed live from the calendar. Best-effort: an
    //    already-missing event shouldn't block removing the booking record, but
    //    we track success so the admin UI can flag it if manual cleanup is needed.
    let calendarDeleted = !calendarEventId;
    if (calendarEventId) {
      try {
        const accessToken = await getGoogleAccessToken();
        const calRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(calendarEventId)}?sendUpdates=all`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
        );
        // 410 Gone means it was already removed from the calendar — still a success.
        calendarDeleted = calRes.ok || calRes.status === 410;
        if (!calendarDeleted) {
          console.error(`Calendar delete failed: ${calRes.status} ${await calRes.text()}`);
        }
      } catch (err) {
        console.error('Calendar delete error:', err);
      }
    }

    // 3. Refund the payment — cancelling a paid booking should return the money.
    //    Best-effort like the calendar step: a missing/already-refunded payment
    //    shouldn't block removing the booking record.
    let refunded = false;
    if (razorpayPaymentId) {
      const keyId     = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keyId && keySecret) {
        try {
          const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
          await razorpay.payments.refund(razorpayPaymentId, { speed: 'optimum' });
          refunded = true;
          if (booking?.email && booking?.name && booking?.date && booking?.slot) {
            await sendRefundEmail({
              toEmail: booking.email,
              name:    booking.name,
              date:    booking.date,
              slot:    booking.slot,
              razorpayPaymentId,
            });
          }
        } catch (err) {
          console.error('Refund error:', err);
        }
      } else {
        console.error('Refund skipped: Razorpay not configured');
      }
    } else {
      refunded = true; // nothing to refund
    }

    // 4. Delete the Supabase row
    const delRes = await fetch(
      `${url}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`,
      { method: 'DELETE', headers: { ...supabaseHeaders(serviceKey), Prefer: 'return=minimal' } },
    );
    if (!delRes.ok) {
      const text = await delRes.text();
      return res.status(delRes.status).json({ error: text });
    }

    res.json({ ok: true, calendarDeleted, refunded });
  } catch (err) {
    console.error('delete-booking error:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
}
