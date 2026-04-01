import { lockSeats } from "../services/lockService.js";
import { createBooking } from "../services/bookingService.js";

export const createBookingController = async (req, res) => {
  try {
    const { showId, seats, userEmail } = req.body;

    if (!showId || !seats?.length || !userEmail) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const result = await createBooking({ showId, seats, userEmail });

    res.json({
      success: true,
      bookingId: result.bookingId
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const lockSeatsController = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats?.length) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const result = await lockSeats(showId, seats);

    res.json({
      success: true,
      bookingId: result.bookingId,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};