import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const runMigration = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    const dbName = process.env.DB_NAME;

    console.log("Connected to MySQL");

    // RESET DB
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    await connection.query(`CREATE DATABASE \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    // RUN SCHEMA
    const sql = fs.readFileSync("./database/schema.sql", "utf8"); // Updated path from ./databases/schema.sql to ./database/schema.sql
    await connection.query(sql);

    console.log("Schema created");

    // =====================================
    // 🌱 SEED PERMISSIONS
    // =====================================
    const permissions = [
      "user.read", "user.update", "user.delete",
      "class.create", "class.delete", "class.join",
      "assignment.create", "assignment.submit",
      "submission.view", "grade.create", "admin.dashboard", "admin.logs"
    ];

    for (const p of permissions) {
      await connection.query("INSERT INTO permissions (name) VALUES (?)", [p]);
    }

    // =====================================
    // 🌱 SEED ROLE PERMISSIONS
    // =====================================
    const [roleRows] = await connection.query("SELECT id, name FROM roles");
    const roles = {};
    roleRows.forEach(r => roles[r.name] = r.id);

    const [permRows] = await connection.query("SELECT id, name FROM permissions");
    const perms = {};
    permRows.forEach(p => perms[p.name] = p.id);

    const roleMap = {
      admin: permissions,
      teacher: ["class.create", "class.delete", "assignment.create", "submission.view", "grade.create", "user.read"],
      student: ["class.join", "assignment.submit", "submission.view", "user.read"]
    };

    for (const [roleName, rolePerms] of Object.entries(roleMap)) {
      const roleId = roles[roleName];
      for (const pName of rolePerms) {
        await connection.query(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
          [roleId, perms[pName]]
        );
      }
    }

    console.log("Permissions seeded 🛡️");

    // =====================================
    // 🌱 SEED ADMIN USER
    // =====================================
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      `INSERT INTO users (username, email, password_hash, role_id, is_validated)
       VALUES (?, ?, ?, ?, ?)`,
      ["admin", "admin@example.com", hashedPassword, roles.admin, true]
    );

    const adminId = userResult.insertId;

    await connection.query(
      `INSERT INTO user_profiles (user_id, first_name, last_name)
       VALUES (?, ?, ?)`,
      [adminId, "System", "Admin"]
    );

    console.log("Admin user seeded 🚀");
    console.log("Login with:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    await connection.end();
    process.exit(0);

  } catch (err) {
    console.error("Migration error:", err.message);
    process.exit(1);
  }
};

runMigration();
