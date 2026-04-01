import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({ groupId: "payment-group" });
export const producer = kafka.producer();   