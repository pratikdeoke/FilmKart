import { producer } from "../config/kafka.js";

export const publishEvent = async (topic, data) => {
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(data) },
    ],
  });
};