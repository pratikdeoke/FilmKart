import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


// async function checkDBConnection() {
//   try {
//     const client = await pool.connect();
//     await client.query("SELECT 1");
//     client.release();

//     console.log("✅ PostgreSQL connected successfully");
//   } catch (err) {
//     console.error("❌ PostgreSQL connection failed:");
//     console.error(err.message);

//     process.exit(1);
//   }
// }

// checkDBConnection();

export default pool;