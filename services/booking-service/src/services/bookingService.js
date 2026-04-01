import pool from "../config/db.js";
import redis from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";
import { publishEvent } from "../utils/kafkaProducer.js";
import {
  insertBooking,
  insertBookingSeats,
} from "../repositories/bookingRepository.js";

export const createBooking = async ({ showId, seats, userEmail }) => {
  const client = await pool.connect();
  const bookingId = uuidv4();

  try {
    await client.query("BEGIN");

    // 🔒 Validate Redis locks
    for (const seat of seats) {
      const key = `lock:${showId}:${seat}`;
      const lock = await redis.get(key);

      if (!lock) {
        throw new Error(`Seat ${seat} not locked`);
      }
    }

    // 🧾 DB insert via repository
    await insertBooking(client, { bookingId, userEmail, showId });

    await insertBookingSeats(client, { bookingId, showId, seats });

    await client.query("COMMIT");

    // 🚀 Kafka event AFTER commit
    await publishEvent("booking.created", {
      bookingId,
      userEmail,
      showId,
      seats,
    });

    return { bookingId };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;

  } finally {
    client.release();
  }
};

export const fetchBooking = async (bookingId) => {
  const client = await pool.connect();

  try {
    const result = await getBookingById(client, bookingId);

    if (!result) throw new Error("Booking not found");

    return result;

  } finally {
    client.release();
  }
};