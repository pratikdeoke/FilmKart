import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const dbPassword = String(process.env.DB_PASSWORD ?? "").trim();

if (!dbPassword) {
  throw new Error("DB_PASSWORD is missing or empty");
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: dbPassword,
  port: Number(process.env.DB_PORT) || 5432,
});

export default pool;