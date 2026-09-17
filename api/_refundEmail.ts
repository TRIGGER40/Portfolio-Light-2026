/**
 * Shared "refund initiated" email — sent from both delete-booking.ts (admin
 * cancels via the dashboard) and list-bookings.ts (event was cancelled
 * straight from Google Calendar and caught by the reconciliation check).
 */
import { Resend } from 'resend';

const SLOT_LABELS: Record<string, string> = {
  '18:00': '6:00 PM – 7:00 PM',
  '19:30': '7:30 PM – 8:30 PM',
};

const SESSION_PRICE_LABEL = '₹1,000';

export async function sendRefundEmail(opts: {
  toEmail: string;
  name: string;
  date: string; // YYYY-MM-DD
  slot: string;
  razorpayPaymentId: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('Refund email skipped: RESEND_API_KEY not configured');
    return;
  }

  const dateFormatted = new Date(`${opts.date}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const slotLabel = SLOT_LABELS[opts.slot] ?? opts.slot;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1E1E1B">
      <p style="font-size:14px;line-height:1.6;color:#3A3630">Hi ${opts.name},</p>
      <p style="font-size:14px;line-height:1.6;color:#3A3630">Your session with Midhun on ${dateFormatted} at ${slotLabel} IST has been cancelled, and a refund of ${SESSION_PRICE_LABEL} has been initiated to your original payment method.</p>
      <p style="font-size:14px;line-height:1.6;color:#3A3630">If your bank supports instant refunds, you may see it within a few hours. Otherwise, it typically takes 5-7 business days to reflect, depending on your bank.</p>
      <p style="font-size:14px;line-height:1.6;color:#3A3630">Feel free to reply to this email if you'd like to rebook or have any questions.</p>

      <hr style="border:none;border-top:1px solid #E7DED1;margin:24px 0"/>

      <p style="font-size:12px;font-weight:700;color:#9A9186;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">Refund details</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Amount</td><td style="padding:6px 0;font-weight:600;font-size:14px">${SESSION_PRICE_LABEL}</td></tr>
        <tr><td style="padding:6px 0;color:#9A9186;font-size:13px">Payment ID</td><td style="padding:6px 0;font-weight:600;font-size:14px">${opts.razorpayPaymentId}</td></tr>
      </table>

      <p style="font-size:13px;color:#9A9186;margin-top:32px">— Midhun Krishnakumar<br/><a href="https://midhunkrishnakumar.info" style="color:#234034">midhunkrishnakumar.info</a></p>
    </div>`;

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from:    'Midhun Krishnakumar <bookings@midhunkrishnakumar.info>',
      to:      [opts.toEmail],
      subject: 'Refund initiated for your session with Midhun',
      html,
    });
  } catch (err) {
    console.error('Refund email error:', err);
  }
}
