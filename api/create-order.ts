import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

// General portfolio review session — single fixed price.
const SESSION_AMOUNT = 100000; // ₹1000 in paise

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return res.status(503).json({ error: 'Payment not configured' });

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount:   SESSION_AMOUNT,
      currency: 'INR',
      receipt:  `booking_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch (err) {
    console.error('Razorpay order error', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
