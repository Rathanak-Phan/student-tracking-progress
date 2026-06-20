import dotenv from "dotenv";
dotenv.config({ path: ".env", override: true });

import { initializeDatabase } from "./src/database/index.js";
import db from "./src/database/index.js";

async function checkSchema() {
  await initializeDatabase();
  console.log("DB initialized. Checking schema...");

  const missingColumns = [];

  for (const modelName in db.models) {
    const model = db.models[modelName];
    const tableName = model.tableName;
    
    // Get actual columns from DB
    const [dbColumns] = await db.sequelize.query(`SHOW COLUMNS FROM \`${tableName}\``);
    const dbColumnNames = dbColumns.map(c => c.Field);

    // Get expected columns from Sequelize model
    const expectedColumns = Object.keys(model.rawAttributes);

    for (const expected of expectedColumns) {
      if (!dbColumnNames.includes(expected)) {
        const attribute = model.rawAttributes[expected];
        missingColumns.push({
          table: tableName,
          column: expected,
          type: attribute.type.key || attribute.type.constructor.name
        });
      }
    }
  }

  if (missingColumns.length > 0) {
    console.log("Missing columns found:");
    console.table(missingColumns);
  } else {
    console.log("No missing columns found! Everything is perfectly synced.");
  }

  process.exit(0);
}

checkSchema();
