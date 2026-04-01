import express from "express";
import {
  lockSeatsController,
  createBookingController
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/lock-seats", lockSeatsController);
router.post("/bookings", createBookingController);

export default router;