import { consumer } from "../config/kafka.js";
import { handleTicketGeneration } from "../services/ticketService.js";

export const startTicketConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "payment.success",
    fromBeginning: false,
  });

  console.log("🎟️ Ticket Service listening to payment.success");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        console.log("📥 Received event:", data);

        await handleTicketGeneration(data);

      } catch (err) {
        console.error("❌ Ticket processing error:", err);
      }
    },
  });
};