import { v4 as uuidv4 } from "uuid";

// 🧾 Create booking
export const insertBooking = async (client, { bookingId, userEmail, showId }) => {
  await client.query(
    `INSERT INTO bookings (id, user_email, show_id, status)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, userEmail, showId, "PENDING"]
  );
};

// 🎟️ Insert seats
export const insertBookingSeats = async (client, { bookingId, showId, seats }) => {
  for (const seat of seats) {
    await client.query(
      `INSERT INTO booking_seats (id, booking_id, show_id, seat_id, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), bookingId, showId, seat, "LOCKED"]
    );
  }
};

// 📌 Update booking status
export const updateBookingStatus = async (client, bookingId, status) => {
  await client.query(
    `UPDATE bookings
     SET status = $1, updated_at = NOW()
     WHERE id = $2`,
    [status, bookingId]
  );
};

// 🎟️ Update seats status
export const updateSeatsStatus = async (client, bookingId, status) => {
  await client.query(
    `UPDATE booking_seats
     SET status = $1
     WHERE booking_id = $2`,
    [status, bookingId]
  );
};

export const getBookingById = async (client, bookingId) => {
  const booking = await client.query(
    `SELECT id, user_email, show_id, status
     FROM bookings
     WHERE id = $1`,
    [bookingId]
  );

  const seats = await client.query(
    `SELECT seat_id FROM booking_seats WHERE booking_id = $1`,
    [bookingId]
  );

  return {
    ...booking.rows[0],
    seats: seats.rows.map(s => s.seat_id),
  };
};