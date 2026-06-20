import db from "./src/config/db.js";
async function run() {
  try {
    const [rows] = await db.query("DESCRIBE goals");
    console.log(rows);
  } catch(e) {
    console.log("ERROR", e);
  }
  process.exit();
}
run();
