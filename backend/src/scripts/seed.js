import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { createUserWithRole } from "./helpers/userSeeder.js";

dotenv.config();

const runSeed = async () => {
  try {
    // CREATE CONNECTION FIRST
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to DB for seeding...");

    // =====================================
    // SEED ROLES
    // =====================================
    await connection.query(`
      INSERT IGNORE INTO roles (name) VALUES
      ('admin'),
      ('teacher'),
      ('student')
    `);

    // =====================================
    // SEED DEMO USERS
    // =====================================
    try {
      const teacherId = await createUserWithRole(connection, {
        username: "teacher_demo",
        email: "teacher@example.com",
        password: "teacher123",
        first_name: "Demo",
        last_name: "Teacher"
      }, "teacher");
      console.log("Teacher demo created:", teacherId);

      const studentId = await createUserWithRole(connection, {
        username: "student_demo",
        email: "student@example.com",
        password: "student123",
        first_name: "Demo",
        last_name: "Student"
      }, "student");
      console.log("Student demo created:", studentId);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log("Demo users already seeded.");
      } else {
        throw e;
      }
    }

    await connection.end();

  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

runSeed();
