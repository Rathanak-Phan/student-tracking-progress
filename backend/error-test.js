import db from "./src/database/index.js";
import * as adminUserRepo from "./src/modules/admin/repository/user.repository.js";

async function run() {
  try {
    await db.sequelize.authenticate();
    const records = await adminUserRepo.findAllUsers({ role: 'student' });
    console.log(records.length);
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
run();
