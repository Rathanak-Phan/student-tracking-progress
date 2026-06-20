import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to MySQL");

    const sql = `
      CREATE TABLE IF NOT EXISTS teacher_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          phone VARCHAR(20),
          degree VARCHAR(100) NOT NULL,
          major VARCHAR(100) NOT NULL,
          university VARCHAR(255) NOT NULL,
          graduation_year INT NOT NULL,
          experience_years INT NOT NULL,
          previous_workplace VARCHAR(255),
          subjects JSON NOT NULL,
          documents JSON NOT NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          admin_note TEXT,
          reviewed_by INT DEFAULT NULL,
          reviewed_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `;

    await connection.query(sql);
    console.log("Table teacher_requests created successfully.");

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err.message);
    process.exit(1);
  }
};

run();
