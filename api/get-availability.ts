/**
 * get-availability.ts
 *
 * Checks Midhun's primary Google Calendar (via freeBusy) for a set of dates
 * and reports which of the two mentoring slots are still open on each date.
 *
 * Required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGoogleAccessToken } from './_google.js';

const SLOTS: { value: '18:00' | '19:30'; start: string; end: string }[] = [
  { value: '18:00', start: '18:00', end: '19:00' },
  { value: '19:30', start: '19:30', end: '20:30' },
];

interface DateAvailability {
  available: number;
  slots: Record<string, boolean>; // slot value -> is available
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { dates } = req.body as { dates: string[] };
  if (!Array.isArray(dates) || dates.length === 0) {
    return res.status(400).json({ error: 'dates is required' });
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    return res.status(503).json({ error: 'Calendar not configured' });
  }

  try {
    const accessToken = await getGoogleAccessToken();
    const sortedDates  = [...dates].sort();
    const timeMin = `${sortedDates[0]}T00:00:00+05:30`;
    const timeMax = `${sortedDates[sortedDates.length - 1]}T23:59:59+05:30`;

    const fbRes = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timeMin, timeMax, items: [{ id: 'primary' }] }),
    });
    if (!fbRes.ok) throw new Error(`freeBusy failed: ${fbRes.status}`);

    const data = await fbRes.json() as {
      calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
    };
    const busy = data.calendars?.primary?.busy ?? [];

    const availability: Record<string, DateAvailability> = {};
    for (const date of dates) {
      const slotStatus: Record<string, boolean> = {};
      let available = 0;
      for (const slot of SLOTS) {
        const slotStart = new Date(`${date}T${slot.start}:00+05:30`).getTime();
        const slotEnd   = new Date(`${date}T${slot.end}:00+05:30`).getTime();
        const isBusy = busy.some(b => {
          const busyStart = new Date(b.start).getTime();
          const busyEnd   = new Date(b.end).getTime();
          return slotStart < busyEnd && slotEnd > busyStart;
        });
        slotStatus[slot.value] = !isBusy;
        if (!isBusy) available++;
      }
      availability[date] = { available, slots: slotStatus };
    }

    res.json({ availability });
  } catch (err) {
    console.error('Availability error:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
}
