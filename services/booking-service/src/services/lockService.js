import redis from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";

const LOCK_TTL = 300; // 5 minutes

export const lockSeats = async (showId, seats) => {
  const bookingId = uuidv4();
  const lockedSeats = [];

  try {
    for (const seat of seats) {
      const key = `lock:${showId}:${seat}`;

      const result = await redis.set(key, bookingId, "NX", "EX", LOCK_TTL);

      if (!result) {
        throw new Error(`Seat ${seat} is already locked`);
      }

      lockedSeats.push(key);
    }

    return { bookingId };

  } catch (err) {
    // rollback locks
    for (const key of lockedSeats) {
      await redis.del(key);
    }

    throw err;
  }
};