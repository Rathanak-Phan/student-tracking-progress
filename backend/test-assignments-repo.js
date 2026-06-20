import dotenv from "dotenv";
dotenv.config({ path: ".env", override: true });

import { initializeDatabase } from "./src/database/index.js";
import * as repo from "./src/modules/assignments/repository/assignment.repository.js";

async function run() {
  await initializeDatabase();
  console.log("DB initialized");

  try {
    console.log("Testing findAssignmentsForTeacher...");
    await repo.findAssignmentsForTeacher(1);
    console.log("findAssignmentsForTeacher OK");
  } catch(e) {
    console.error("findAssignmentsForTeacher error:", e.message);
  }

  try {
    console.log("Testing findAssignmentsForStudent...");
    await repo.findAssignmentsForStudent(1);
    console.log("findAssignmentsForStudent OK");
  } catch(e) {
    console.error("findAssignmentsForStudent error:", e.message);
  }

  process.exit(0);
}

run();
