import db from "./src/database/index.js";

async function test() {
  try {
    console.log("Running query...");
    const result = await db.sequelize.query(
      `SELECT pe.id AS id, pe.class_id, pe.student_id, pe.status, pe.requested_at,
            u.username, u.email, p.first_name, p.last_name
     FROM pending_enrollments pe
     JOIN users u ON pe.student_id = u.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE pe.class_id = ? AND pe.status = 'pending'
     ORDER BY pe.requested_at ASC`,
      { replacements: ['4'] }
    );
    console.log("Success:", result);
  } catch (err) {
    console.error("SQL Error Message:", err.message);
    console.error("SQL Error Code:", err.parent ? err.parent.code : "N/A");
  } finally {
    process.exit();
  }
}

test();
