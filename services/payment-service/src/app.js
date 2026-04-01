import { consumer, producer } from "./config/kafka.js";
import { startBookingConsumer } from "./consumers/bookingConsumer.js";

const start = async () => {
  try {
    await producer.connect();
    console.log("Producer connected");

    await startBookingConsumer();

  } catch (err) {
    console.error("Error starting payment service:", err);
  }
};

start();