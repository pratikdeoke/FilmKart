import { producer } from "../config/kafka.js";

export const publishEvent = async (topic, data) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });
  } catch (err) {
    console.error("Kafka publish error:", err);
  }
};