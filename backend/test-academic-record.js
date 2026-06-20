import dotenv from "dotenv";
dotenv.config({ path: ".env", override: true });

import { initializeDatabase } from "./src/database/index.js";
import * as repo from "./src/modules/users/repository/index.js";

async function run() {
  await initializeDatabase();
  console.log("DB initialized");

  try {
    console.log("Testing getAcademicRecord...");
    await repo.getAcademicRecord(1);
    console.log("getAcademicRecord OK");
  } catch(e) {
    console.error("getAcademicRecord error:", e.message);
  }

  process.exit(0);
}

run();
