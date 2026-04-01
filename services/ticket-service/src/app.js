import dotenv from "dotenv";
dotenv.config();

import { startTicketConsumer } from "./consumers/ticketConsumer.js";

const start = async () => {
  try {
    await startTicketConsumer();
  } catch (err) {
    console.error("❌ Ticket service error:", err);
  }
};

start();