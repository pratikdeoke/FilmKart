import express from "express";
import {
  lockSeatsController,
  createBookingController,
  getBookingController
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/lock-seats", lockSeatsController);
router.post("/bookings", createBookingController);
router.get("/booking/:id", getBookingController);

export default router;