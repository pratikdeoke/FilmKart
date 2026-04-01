import express from "express";
import { producer } from "./config/kafka.js";
import { startPaymentConsumer } from "./consumers/paymentConsumer.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
app.use(express.json());
app.use("/api", bookingRoutes);

const startServer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer Connected");

    await startPaymentConsumer();

    app.listen(3000, () => {
      console.log("Booking Service running on port 3000");
    });

  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();