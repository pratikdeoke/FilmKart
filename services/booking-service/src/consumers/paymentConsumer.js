import { consumer } from "../config/kafka.js";
import pool from "../config/db.js";
import redis from "../config/redis.js";

import {
  updateBookingStatus,
  updateSeatsStatus,
} from "../repositories/bookingRepository.js";

export const startPaymentConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: "payment.success" });
  await consumer.subscribe({ topic: "payment.failed" });

  console.log("Booking Service listening to payment events");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        if (topic === "payment.success") {
          console.log("Payment SUCCESS:", data.bookingId);

          await updateBookingStatus(client, data.bookingId, "CONFIRMED");
          await updateSeatsStatus(client, data.bookingId, "CONFIRMED");

        } else {
          console.log("Payment FAILED:", data.bookingId);

          await updateBookingStatus(client, data.bookingId, "FAILED");
          await updateSeatsStatus(client, data.bookingId, "RELEASED");
        }

        // 🔥 GET SEATS FROM DB
        const result = await client.query(
          `SELECT seat_id, show_id FROM booking_seats WHERE booking_id = $1`,
          [data.bookingId]
        );

        // 🔥 RELEASE REDIS LOCKS
        for (const row of result.rows) {
          const key = `lock:${row.show_id}:${row.seat_id}`;
          await redis.del(key);
        }

        await client.query("COMMIT");

      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error processing payment event:", err);

      } finally {
        client.release();
      }
    },
  });
};