import dotenv from "dotenv";
dotenv.config({ path: "src/.env", override: true }); // Ensure proper dotenv if needed

import { initializeDatabase } from "./src/database/index.js";
import * as repo from "./src/modules/classes/repository/class.repository.js";

async function run() {
  await initializeDatabase();
  console.log("DB initialized");

  try {
    console.log("Testing findAll...");
    await repo.findAll();
    console.log("findAll OK");
  } catch(e) {
    console.error("findAll error:", e.message);
  }

  try {
    console.log("Testing findByTeacher...");
    await repo.findByTeacher(1);
    console.log("findByTeacher OK");
  } catch(e) {
    console.error("findByTeacher error:", e.message);
  }

  try {
    console.log("Testing findByStudent...");
    await repo.findByStudent(1);
    console.log("findByStudent OK");
  } catch(e) {
    console.error("findByStudent error:", e.message);
  }

  process.exit(0);
}

run();
