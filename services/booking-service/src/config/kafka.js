import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "booking-service",
  brokers: ["localhost:9092"],

  // 🔥 Keep it simple (NO auth, NO SSL)
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "booking-group",
});