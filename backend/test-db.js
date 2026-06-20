import db from "./src/database/index.js";
import { findAllAssignments } from "./src/modules/admin/repository/assignment.repository.js";

async function run() {
    try {
        await db.sequelize.authenticate();
        console.log("Connected");
        const a = await findAllAssignments();
        console.log(a.length);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
