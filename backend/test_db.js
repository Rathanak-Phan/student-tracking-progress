import { getStudentDashboard } from "./src/modules/dashboard/service/dashboard.service.js";
async function run() {
  try {
    const res = await getStudentDashboard(5); // Assuming studentId 5 exists
    console.log("SUCCESS");
  } catch(e) {
    console.log("ERROR", e);
  }
  process.exit();
}
run();
