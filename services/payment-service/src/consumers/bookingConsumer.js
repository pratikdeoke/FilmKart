import { consumer } from "../config/kafka.js";
import { publishEvent } from "../utils/kafkaProducer.js";
import { processPayment } from "../services/paymentService.js";

export const startBookingConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "booking.created",
    fromBeginning: false,
  });

  console.log("💳 Payment Service listening to booking.created");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      try {
        console.log("📥 Received booking:", data);

        const paymentResult = await processPayment(data);

        // ✅ SUCCESS EVENT (ENRICHED EVENT)
        await publishEvent("payment.success", {
          bookingId: data.bookingId,
          transactionId: paymentResult.transactionId,
          userEmail: data.userEmail,
          seats: data.seats,
        });

        console.log("✅ Payment success published");

      } catch (err) {

        // ❌ FAILURE EVENT
        await publishEvent("payment.failed", {
          bookingId: data.bookingId,
          reason: err.message,
        });

        console.log("❌ Payment failed:", err.message);
      }
    },
  });
};