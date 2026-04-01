import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bookingRoutes from "./routes/bookingRoutes.js";
import { producer } from "./config/kafka.js";

const app = express();
app.use(express.json());

app.use("/api", bookingRoutes);

// 🔥 connect kafka BEFORE server starts
const startServer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer Connected");

    app.listen(process.env.PORT || 3000, () => {
      console.log("Booking Service running");
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();