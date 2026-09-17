/**
 * confirm-booking.ts
 *
 * 1. Verifies Razorpay payment signature (HMAC-SHA256)
 * 2. Creates a Google Calendar event with a Google Meet link
 *    via direct REST API calls — no googleapis SDK needed
 * 3. Sends confirmation emails via Resend
 *
 * Required env vars:
 *   RAZORPAY_KEY_SECRET
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 *   RESEND_API_KEY
 *   BOOKING_NOTIFY_EMAIL   (defaults to midhun2k14@gmail.com)
 *
 * Google OAuth2 setup:
 *   1. Google Cloud Console → enable Calendar API
 *   2. Create OAuth 2.0 credentials (Desktop app)
 *   3. OAuth2 Playground → scope: https://www.googleapis.com/auth/calendar
 *   4. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { Resend } from 'resend';
import { getGoogleAccessToken } from './_google.js';
import { getSupabaseConfig, supabaseHeaders } from './_supabase.js';

interface BookingBody {
  razorpayOrderId:   string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  name:    string;
  email:   string;
  reason:  string;
  date:    string; // YYYY-MM-DD
  slot:    '18:00' | '19:30';
}

const EVENT_TITLE = 'Session with Midhun Krishnakumar';
const SESSION_PRICE_LABEL = '₹1,000';

const SLOT_END: Record<string, string> = {
  '18:00': '19:00',
  '19:30': '20:30',
};

const SLOT_LABELS: Record<string, string> = {
  '18:00': '6:00 PM – 7:00 PM',
  '19:30': '7:30 PM – 8:30 PM',
};

/* ── Create Google Calendar event with Meet link ───────────── */
async function createCalendarEvent(opts: {
  accessToken: string;
  summary:     string;
  description: string;
  date:        string;
  startTime:   string;
  endTime:     string;
  attendees:   string[];
  requestId:   string;
}) {
  const body: Record<string, unknown> = {
    summary:     opts.summary,
    description: opts.description,
    start: { dateTime: `${opts.date}T${opts.startTime}:00+05:30`, timeZone: 'Asia/Kolkata' },
    end:   { dateTime: `${opts.date}T${opts.endTime}:00+05:30`,   timeZone: 'Asia/Kolkata' },
    attendees: opts.attendees.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: opts.requestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    + '?conferenceDataVersion=1&sendUpdates=all';

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${opts.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Calendar insert failed: ${res.status} attendees=${JSON.stringify(opts.attendees)} ${errBody}`);
  }
  const event = await res.json() as {
    id: string;
    conferenceData?: { entryPoints?: { entryPointType: string; uri: string }[] };
  };

  const meetLink = event.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri ?? '';
  return { eventId: event.id, meetLink };
}

/* ── Handler ────────────────────────────────────────────────── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    razorpayOrderId, razorpayPaymentId, razorpaySignature,
    name: rawName, email: rawEmail, reason: rawReason, date, slot,
  } = req.body as BookingBody;

  const name   = rawName?.trim();
  const email  = rawEmail?.trim();
  const reason = rawReason?.trim();

  if (!name || !email || !reason || !date || !slot) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  // 1. Verify Razorpay signature
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(503).json({ error: 'Payment not configured' });

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSig !== razorpaySignature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  const slotLabel     = SLOT_LABELS[slot];
  const notifyEmail   = process.env.BOOKING_NOTIFY_EMAIL ?? 'midhun2k14@gmail.com';
  const dateFormatted = new Date(`${date}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const dateShort = new Date(`${date}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric',
  });

  let meetLink = '';
  let calendarEventId: string | null = null;

  // 2. Create Google Calendar event (invites booker + Midhun, with Meet link)
  try {
    const accessToken = await getGoogleAccessToken();
    const result = await createCalendarEvent({
      accessToken,
      summary:     EVENT_TITLE,
      description: [
        'Hi there,',
        '',
        "Thanks for booking a 1:1 session with me! I'm looking forward to meeting you.",
        '',
        'To make the most of our time together, please reply to midhun2k14@gmail.com before the session with:',
        '',
        '- A brief introduction about yourself.',
        "- What you'd like to discuss during the session.",
        '- Any relevant links you\'d like me to review beforehand (portfolio, resume, LinkedIn, Figma, case studies, or anything else).',
        '',
        "If you're unsure what you'd like to focus on, that's completely okay! We can figure it out together during the session.",
        '',
        "You'll find the Google Meet link and other details in the calendar invite. If you need to reschedule, please let me know as early as possible.",
        '',
        'Looking forward to our conversation!',
        '',
        '---',
        `Booked by: ${name} (${email})`,
        `Reason for booking: ${reason}`,
        `Payment ID: ${razorpayPaymentId}`,
      ].join('\n'),
      date,
      startTime: slot,
      endTime:   SLOT_END[slot],
      attendees: [notifyEmail, email],
      requestId: razorpayPaymentId,
    });
    meetLink = result.meetLink;
    calendarEventId = result.eventId;
  } catch (err) {
    console.error('Calendar error:', err);
    // Non-fatal — booking still confirmed, just without Meet link
  }

  // 3. Send confirmation emails via Resend.
  //    Booker gets exactly one email (this) plus the separate Google Calendar
  //    invite — no third email. Owner gets a distinct internal notification.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const bookerHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1E1E1B">
        <p style="font-size:14px;line-height:1.6;color:#3A3630">Hi ${name},</p>
        <p style="font-size:14px;line-height:1.6;color:#3A3630">Thanks for booking a 1:1 session with me! I'm looking forward to meeting you.</p>
        <p style="font-size:14px;line-height:1.6;color:#3A3630">To make the most of our time together, please reply to midhun2k14@gmail.com before the session with:</p>
        <ul style="font-size:14px;line-height:1.7;color:#3A3630;padding-left:20px;margin:0 0 16px">
          <li>A brief introduction about yourself.</li>
          <li>What you'd like to discuss during the session.</li>
          <li>Any relevant links you'd like me to review beforehand (portfolio, resume, LinkedIn, Figma, case studies, or anything else).</li>
        </ul>
        <p style="font-size:14px;line-height:1.6;color:#3A3630">If you're unsure what you'd like to focus on, that's completely okay! We can figure it out together during the session.</p>
        <p style="font-size:14px;line-height:1.6;color:#3A3630">You'll find the Google Meet link and other details in the calendar invite. If you need to reschedule, please let me know as early as possible.</p>
        <p style="font-size:14px;line-height:1.6;color:#3A3630">Looking forward to our conversation!</p>

        <hr style="border:none;border-top:1px solid #E7DED1;margin:24px 0"/>

        <p style="font-size:12px;font-weight:700;color:#9A9186;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">Booking details</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Session</td><td style="padding:6px 0;font-weight:600;font-size:14px">${EVENT_TITLE}</td></tr>
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Date</td><td style="padding:6px 0;font-weight:600;font-size:14px">${dateFormatted}</td></tr>
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Time</td><td style="padding:6px 0;font-weight:600;font-size:14px">${slotLabel} IST</td></tr>
          ${meetLink ? `<tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Meet link</td><td style="padding:6px 0;font-size:14px"><a href="${meetLink}" style="color:#234034;font-weight:600">${meetLink}</a></td></tr>` : ''}
        </table>

        <p style="font-size:12px;font-weight:700;color:#9A9186;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">Payment confirmation</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Amount paid</td><td style="padding:6px 0;font-weight:600;font-size:14px">${SESSION_PRICE_LABEL}</td></tr>
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Payment ID</td><td style="padding:6px 0;font-weight:600;font-size:14px">${razorpayPaymentId}</td></tr>
        </table>

        <p style="font-size:13px;color:#9A9186;margin-top:32px">— Midhun Krishnakumar<br/><a href="https://midhunkrishnakumar.info" style="color:#234034">midhunkrishnakumar.info</a></p>
      </div>`;

    const ownerHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1E1E1B">
        <p style="font-size:14px;line-height:1.6;color:#3A3630">Hey Midhun,</p>
        <p style="font-size:14px;line-height:1.6;color:#3A3630">${name} has booked a paid session with you on ${dateFormatted} at ${slotLabel} IST.</p>

        <hr style="border:none;border-top:1px solid #E7DED1;margin:24px 0"/>

        <p style="font-size:12px;font-weight:700;color:#9A9186;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">Details</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Name</td><td style="padding:6px 0;font-weight:600;font-size:14px">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Email</td><td style="padding:6px 0;font-weight:600;font-size:14px">${email}</td></tr>
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Reason</td><td style="padding:6px 0;font-weight:600;font-size:14px">${reason}</td></tr>
          ${meetLink ? `<tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Meet link</td><td style="padding:6px 0;font-size:14px"><a href="${meetLink}" style="color:#234034;font-weight:600">${meetLink}</a></td></tr>` : ''}
        </table>

        <p style="font-size:12px;font-weight:700;color:#9A9186;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">Payment confirmation</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Amount paid</td><td style="padding:6px 0;font-weight:600;font-size:14px">${SESSION_PRICE_LABEL}</td></tr>
          <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Payment ID</td><td style="padding:6px 0;font-weight:600;font-size:14px">${razorpayPaymentId}</td></tr>
        </table>
      </div>`;

    await Promise.all([
      resend.emails.send({
        from:    'Midhun Krishnakumar <bookings@midhunkrishnakumar.info>',
        to:      [email],
        subject: `Session with Midhun booked successfully`,
        html:    bookerHtml,
      }),
      resend.emails.send({
        from:    'Booking System <bookings@midhunkrishnakumar.info>',
        to:      [notifyEmail],
        subject: `${name} booked a session for ${dateShort}`,
        html:    ownerHtml,
      }),
    ]);
  } catch (err) {
    console.error('Email error:', err);
  }

  // 4. Persist the booking record (powers the admin Bookings table)
  try {
    const { url, serviceKey } = getSupabaseConfig();
    if (url && serviceKey) {
      await fetch(`${url}/rest/v1/bookings`, {
        method:  'POST',
        headers: { ...supabaseHeaders(serviceKey), Prefer: 'return=minimal' },
        body: JSON.stringify({
          name,
          email,
          reason,
          date,
          slot,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id:   razorpayOrderId,
          calendar_event_id:   calendarEventId,
          meet_link:           meetLink || null,
        }),
      });
    }
  } catch (err) {
    console.error('Bookings table insert error:', err);
  }

  res.json({ success: true, meetLink });
}
