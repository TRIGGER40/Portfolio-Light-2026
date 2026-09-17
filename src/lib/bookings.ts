export interface Booking {
  id: string;
  name: string;
  email: string;
  reason: string;
  date: string; // YYYY-MM-DD
  slot: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  calendar_event_id: string | null;
  meet_link: string | null;
  created_at: string;
}

export async function fetchBookings(): Promise<Booking[]> {
  try {
    const res = await fetch('/api/list-bookings');
    if (!res.ok) return [];
    const data = await res.json() as { bookings?: Booking[] };
    return data.bookings ?? [];
  } catch {
    return [];
  }
}

export async function deleteBooking(id: string): Promise<{ ok: boolean; error?: string; calendarDeleted?: boolean; refunded?: boolean }> {
  try {
    const res = await fetch('/api/delete-booking', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id }),
    });
    if (!res.ok) return { ok: false, error: 'server_error' };
    const data = await res.json() as { calendarDeleted?: boolean; refunded?: boolean };
    return { ok: true, calendarDeleted: data.calendarDeleted, refunded: data.refunded };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}
