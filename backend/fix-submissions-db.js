import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env", override: true });

async function fix() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to MySQL. Adding content column to submissions...");
    await connection.query("ALTER TABLE submissions ADD COLUMN content TEXT NULL;");
    console.log("Column added successfully!");

    await connection.end();
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("Column content already exists.");
    } else {
      console.error("Error:", err.message);
    }
  }
}

fix();
