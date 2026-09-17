import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { getSupabaseConfig, supabaseHeaders } from './_supabase.js';
import { getGoogleAccessToken } from './_google.js';
import { sendRefundEmail } from './_refundEmail.js';

interface Booking {
  id: string;
  calendar_event_id?: string | null;
  razorpay_payment_id?: string | null;
  name?: string | null;
  email?: string | null;
  date?: string | null;
  slot?: string | null;
  [key: string]: unknown;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey) return res.status(503).json({ error: 'Bookings store not configured' });

  try {
    const r = await fetch(
      `${url}/rest/v1/bookings?select=*&order=date.asc,slot.asc`,
      { headers: supabaseHeaders(serviceKey) },
    );
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: text });
    }
    let bookings = await r.json() as Booking[];

    // Reconcile with Google Calendar: if an event was deleted or cancelled
    // directly in Calendar (bypassing our own delete-booking flow), the
    // booking is just as gone — clean it up here so the admin table never
    // shows a stale row.
    const withEventId = bookings.filter(b => b.calendar_event_id);
    if (withEventId.length > 0) {
      try {
        const accessToken = await getGoogleAccessToken();
        const staleIds: string[] = [];

        await Promise.all(withEventId.map(async b => {
          const evRes = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(b.calendar_event_id!)}`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          if (evRes.status === 404 || evRes.status === 410) {
            staleIds.push(b.id);
            return;
          }
          if (evRes.ok) {
            const ev = await evRes.json() as { status?: string };
            if (ev.status === 'cancelled') staleIds.push(b.id);
          }
        }));

        if (staleIds.length > 0) {
          // A booking cancelled straight from Calendar still had a real
          // payment taken — refund it the same as an admin-initiated delete.
          const keyId     = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (keyId && keySecret) {
            const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
            await Promise.all(staleIds.map(async staleId => {
              const stale = bookings.find(b => b.id === staleId);
              const paymentId = stale?.razorpay_payment_id;
              if (!paymentId) return;
              try {
                await razorpay.payments.refund(paymentId, { speed: 'optimum' });
                if (stale?.email && stale?.name && stale?.date && stale?.slot) {
                  await sendRefundEmail({
                    toEmail: stale.email,
                    name:    stale.name,
                    date:    stale.date,
                    slot:    stale.slot,
                    razorpayPaymentId: paymentId,
                  });
                }
              } catch (err) {
                console.error(`Refund error for stale booking ${staleId}:`, err);
              }
            }));
          }

          await fetch(
            `${url}/rest/v1/bookings?id=in.(${staleIds.map(id => encodeURIComponent(id)).join(',')})`,
            { method: 'DELETE', headers: { ...supabaseHeaders(serviceKey), Prefer: 'return=minimal' } },
          );
          bookings = bookings.filter(b => !staleIds.includes(b.id));
        }
      } catch (err) {
        console.error('Calendar reconciliation error:', err);
        // Non-fatal — fall back to showing bookings as stored
      }
    }

    res.json({ bookings });
  } catch (err) {
    console.error('list-bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
