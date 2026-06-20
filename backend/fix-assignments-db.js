import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function fix() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to MySQL. Adding available_from and submission_type columns to assignments...");
    await connection.query("ALTER TABLE assignments ADD COLUMN available_from DATETIME NULL, ADD COLUMN submission_type VARCHAR(20) DEFAULT 'file';");
    console.log("Columns added successfully!");

    await connection.end();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

fix();
