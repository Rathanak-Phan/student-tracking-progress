import db from "../../../database/index.js";

// Create a pending enrollment request
export const createPendingEnrollment = async (classId, studentId) => {
  await db.sequelize.query(
    `INSERT INTO pending_enrollments (class_id, student_id) VALUES (?, ?)`,
    { replacements: [classId, studentId] }
  );
};

// Check if there's already a pending or active enrollment
export const checkExistingEnrollment = async (classId, studentId) => {
  const [rows] = await db.sequelize.query(
    `SELECT * FROM enrollments WHERE class_id = ? AND student_id = ?`,
    { replacements: [classId, studentId] }
  );
  if (rows.length > 0) return true;

  const [pendingRows] = await db.sequelize.query(
    `SELECT * FROM pending_enrollments WHERE class_id = ? AND student_id = ? AND status IN ('pending', 'approved')`,
    { replacements: [classId, studentId] }
  );
  return pendingRows.length > 0;
};

// Get pending join requests for a teacher's class
export const getPendingRequests = async (classId) => {
  const [rows] = await db.sequelize.query(
    `SELECT pe.id AS id, pe.class_id, pe.student_id, pe.status, pe.requested_at,
            u.username, u.email, p.first_name, p.last_name
     FROM pending_enrollments pe
     JOIN users u ON pe.student_id = u.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE pe.class_id = ? AND pe.status = 'pending'
     ORDER BY pe.requested_at ASC`,
    { replacements: [classId] }
  );
  return rows;
};

// Approve a join request
export const approvePendingRequest = async (requestId, classId, studentId) => {
  try {
    // First check if already enrolled
    const [existingEnrollment] = await db.sequelize.query(
      `SELECT * FROM enrollments WHERE class_id = ? AND student_id = ?`,
      { replacements: [classId, studentId] }
    );
    
    if (existingEnrollment.length > 0) {
      // Already enrolled, just update the pending request
      await db.sequelize.query(
        `UPDATE pending_enrollments SET status = 'approved', responded_at = NOW() WHERE id = ?`,
        { replacements: [requestId] }
      );
      return;
    }

    // Insert into enrollments
    await db.sequelize.query(
      `INSERT INTO enrollments (class_id, student_id) VALUES (?, ?)`,
      { replacements: [classId, studentId] }
    );

    // Update pending request status
    await db.sequelize.query(
      `UPDATE pending_enrollments SET status = 'approved', responded_at = NOW() WHERE id = ?`,
      { replacements: [requestId] }
    );
  } catch (error) {
    console.error(`[ERROR] Failed to approve pending request ${requestId}:`, error);
    throw error;
  }
};

// Reject a join request
export const rejectPendingRequest = async (requestId) => {
  await db.sequelize.query(
    `UPDATE pending_enrollments SET status = 'rejected', responded_at = NOW() WHERE id = ?`,
    { replacements: [requestId] }
  );
};

// Get all pending and approved requests for a class
export const getClassJoinRequests = async (classId, status = null) => {
  let query = `
    SELECT pe.id AS id, pe.class_id, pe.student_id, pe.status, pe.requested_at, pe.responded_at,
           u.username, u.email, p.first_name, p.last_name
    FROM pending_enrollments pe
    JOIN users u ON pe.student_id = u.id
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE pe.class_id = ?
  `;

  const params = [classId];

  if (status) {
    query += ` AND pe.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY pe.requested_at DESC`;

  const [rows] = await db.sequelize.query(query, { replacements: params });
  return rows;
};

// Get a specific pending request by ID
export const getPendingRequestById = async (requestId, classId) => {
  console.log(`[DEBUG REPO] Querying pending request: requestId=${requestId}, classId=${classId}, types: ${typeof requestId} ${typeof classId}`);
  
  // First, check if the pending request exists at all
  const [basicRows] = await db.sequelize.query(
    `SELECT * FROM pending_enrollments WHERE id = ? AND class_id = ?`,
    { replacements: [requestId, classId] }
  );
  
  console.log(`[DEBUG REPO] Basic query returned:`, basicRows);
  
  if (!basicRows || basicRows.length === 0) {
    console.log(`[DEBUG REPO] No pending enrollment found with id=${requestId}, classId=${classId}`);
    
    // Try without classId filter to see if request exists but in different class
    const [anyRequest] = await db.sequelize.query(
      `SELECT * FROM pending_enrollments WHERE id = ?`,
      { replacements: [requestId] }
    );
    console.log(`[DEBUG REPO] Request with id ${requestId} in ANY class:`, anyRequest);
    return null;
  }

  // Now try the full JOIN query
  const [rows] = await db.sequelize.query(
    `SELECT pe.id AS id, pe.class_id, pe.student_id, pe.status, pe.requested_at,
            u.username, u.email, p.first_name, p.last_name
     FROM pending_enrollments pe
     JOIN users u ON pe.student_id = u.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE pe.id = ? AND pe.class_id = ?`,
    { replacements: [requestId, classId] }
  );
  
  console.log(`[DEBUG REPO] Full JOIN query returned:`, rows);
  return rows ? rows[0] : null;
};
