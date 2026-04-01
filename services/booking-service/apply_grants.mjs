import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Client } = pkg;

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD ?? "").trim(),
  port: Number(process.env.DB_PORT) || 5432,
});

const sql = `
GRANT USAGE ON SCHEMA public TO movie_ticket_booking_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE bookings TO movie_ticket_booking_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE booking_seats TO movie_ticket_booking_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO movie_ticket_booking_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO movie_ticket_booking_user;
`;

try {
  await client.connect();
  await client.query(sql);
  console.log("DB grants applied successfully");
} catch (e) {
  console.error("Grant apply failed:", e.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
