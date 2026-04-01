import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "ticket-service",
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({ groupId: "ticket-group" });