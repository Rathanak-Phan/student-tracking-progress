import db from "../../../database/index.js";

// Student Dashboard Data
export const getEnrolledClasses = async (studentId) => {
  const [rows] = await db.sequelize.query(
    `SELECT c.*, u.username as teacher_name,
     (SELECT COUNT(*) FROM assignments a WHERE a.class_id = c.id) as total_assignments,
     (SELECT COUNT(*) FROM submissions s JOIN assignments a ON s.assignment_id = a.id 
      WHERE a.class_id = c.id AND s.student_id = :studentId) as completed_assignments
     FROM classes c
     JOIN enrollments e ON c.id = e.class_id
     JOIN users u ON c.teacher_id = u.id
     WHERE e.student_id = :studentId AND e.status = 'active'`,
    { replacements: { studentId } }
  );
  return rows;
};

export const getStudentAssignments = async (studentId) => {
  const [rows] = await db.sequelize.query(
    `SELECT a.*, c.name as class_name, s.status as submission_status, g.score as grade, s.submitted_at
     FROM assignments a
     JOIN enrollments e ON a.class_id = e.class_id
     JOIN classes c ON a.class_id = c.id
     LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = :studentId
     LEFT JOIN grades g ON s.id = g.submission_id
     WHERE e.student_id = :studentId AND e.status = 'active'
     ORDER BY a.due_date ASC`,
    { replacements: { studentId } }
  );
  return rows;
};

export const getStudentPerformance = async (studentId) => {
  const [rows] = await db.sequelize.query(
    `SELECT 
      (SUM(g.score) / SUM(a.max_score) * 100) as average_grade, 
      SUM(g.score) as total_earned_score,
      SUM(a.max_score) as total_max_score,
      COUNT(g.id) as graded_count
     FROM grades g
     JOIN submissions s ON g.submission_id = s.id
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = ? AND a.max_score > 0`,
    { replacements: [studentId] }
  );
  return rows[0];
};

export const getStudentGoalStats = async (studentId) => {
  const [rows] = await db.sequelize.query(
    `SELECT 
      COUNT(*) as total_goals,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_goals
     FROM goals
     WHERE student_id = ?`,
    { replacements: [studentId] }
  );
  return rows[0];
};

// Teacher Dashboard Data
export const getTeacherClasses = async (teacherId) => {
  const [rows] = await db.sequelize.query(
    `SELECT c.*, 
     (SELECT COUNT(*) FROM enrollments e WHERE e.class_id = c.id AND e.status = 'active') as student_count
     FROM classes c
     WHERE c.teacher_id = ?`,
    { replacements: [teacherId] }
  );
  return rows;
};

export const getTeacherStats = async (teacherId) => {
  const [totalStudents] = await db.sequelize.query(
    `SELECT COUNT(DISTINCT e.student_id) as count
     FROM enrollments e
     JOIN classes c ON e.class_id = c.id
     WHERE c.teacher_id = ? AND e.status = 'active'`,
    { replacements: [teacherId] }
  );

  const [totalAssignments] = await db.sequelize.query(
    `SELECT COUNT(*) as count
     FROM assignments a
     JOIN classes c ON a.class_id = c.id
     WHERE c.teacher_id = ?`,
    { replacements: [teacherId] }
  );

  const [totalSubmissions] = await db.sequelize.query(
    `SELECT COUNT(*) as count
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN classes c ON a.class_id = c.id
     WHERE c.teacher_id = ?`,
    { replacements: [teacherId] }
  );

  return {
    totalStudents: Number(totalStudents[0].count || 0),
    totalAssignments: Number(totalAssignments[0].count || 0),
    totalSubmissions: Number(totalSubmissions[0].count || 0)
  };
};

export const getTeacherDetailedStats = async (teacherId) => {
  const [avgGrade] = await db.sequelize.query(
    `SELECT AVG(g.score) as average_grade
     FROM grades g
     JOIN submissions s ON g.submission_id = s.id
     JOIN assignments a ON s.assignment_id = a.id
     JOIN classes c ON a.class_id = c.id
     WHERE c.teacher_id = ?`,
    { replacements: [teacherId] }
  );

  const [submissionRate] = await db.sequelize.query(
    `SELECT 
      (SELECT COUNT(*) FROM submissions s 
       JOIN assignments a ON s.assignment_id = a.id 
       JOIN classes c ON a.class_id = c.id 
       WHERE c.teacher_id = :teacherId) / 
      (SELECT COUNT(*) * (SELECT COUNT(*) FROM enrollments e JOIN classes c2 ON e.class_id = c2.id WHERE c2.teacher_id = :teacherId AND e.status = 'active')
       FROM assignments a2 
       JOIN classes c3 ON a2.class_id = c3.id 
       WHERE c3.teacher_id = :teacherId) * 100 as rate`,
    { replacements: { teacherId } }
  );

  return {
    averageGrade: avgGrade[0].average_grade ? parseFloat(avgGrade[0].average_grade).toFixed(2) : "0.00",
    submissionRate: submissionRate[0].rate ? parseFloat(submissionRate[0].rate).toFixed(2) : "0.00"
  };
};

export const getTeacherStudentPerformance = async (teacherId) => {
  const [rows] = await db.sequelize.query(
    `SELECT 
      u.id, u.username, u.email,
      c.id as class_id, c.name as class_name,
      AVG(g.score) as average_grade,
      (SELECT COUNT(*) FROM submissions s2 
       JOIN assignments a2 ON s2.assignment_id = a2.id 
       WHERE s2.student_id = u.id AND a2.class_id = c.id) as submissions_count,
      (SELECT COUNT(*) FROM assignments a3 
       WHERE a3.class_id = c.id) as total_assignments
     FROM users u
     JOIN enrollments e ON u.id = e.student_id
     JOIN classes c ON e.class_id = c.id
     LEFT JOIN submissions s ON u.id = s.student_id
     LEFT JOIN assignments a ON s.assignment_id = a.id AND a.class_id = c.id
     LEFT JOIN grades g ON s.id = g.submission_id
     WHERE c.teacher_id = ? AND e.status = 'active'
     GROUP BY u.id, c.id`,
    { replacements: [teacherId] }
  );
  return rows;
};

export const getTeacherRecentSubmissions = async (teacherId) => {
    const [rows] = await db.sequelize.query(
        `SELECT s.*, u.username as student_name, a.title as assignment_title, c.name as class_name
         FROM submissions s
         JOIN users u ON s.student_id = u.id
         JOIN assignments a ON s.assignment_id = a.id
         JOIN classes c ON a.class_id = c.id
         WHERE c.teacher_id = ?
         ORDER BY s.submitted_at DESC
         LIMIT 10`,
        { replacements: [teacherId] }
    );
    return rows;
};

export const getStudentGradeTrend = async (studentId) => {
  const [rows] = await db.sequelize.query(
    `SELECT g.score, g.graded_at, a.title as assignment_title
     FROM grades g
     JOIN submissions s ON g.submission_id = s.id
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = ?
     ORDER BY g.graded_at ASC`,
    { replacements: [studentId] }
  );
  return rows;
};

export const getAdminStats = async () => {
  const [userStats] = await db.sequelize.query(
    `SELECT 
      COUNT(*) as total_users,
      SUM(CASE WHEN r.name = 'teacher' THEN 1 ELSE 0 END) as total_teachers,
      SUM(CASE WHEN r.name = 'student' THEN 1 ELSE 0 END) as total_students,
      SUM(CASE WHEN is_validated = 0 AND r.name = 'teacher' THEN 1 ELSE 0 END) as pending_teachers
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE is_deleted = FALSE`
  );

  const [classStats] = await db.sequelize.query(
    "SELECT COUNT(*) as total_classes FROM classes"
  );

  return {
    total_users: Number(userStats[0].total_users || 0),
    total_teachers: Number(userStats[0].total_teachers || 0),
    total_students: Number(userStats[0].total_students || 0),
    pending_teachers: Number(userStats[0].pending_teachers || 0),
    total_classes: Number(classStats[0].total_classes || 0)
  };
};

export const getRecentActivities = async (limit = 10) => {
  const [rows] = await db.sequelize.query(
    `SELECT l.*, u.username 
     FROM activity_logs l
     JOIN users u ON l.user_id = u.id
     ORDER BY l.created_at DESC
     LIMIT ?`,
    { replacements: [Number(limit)] }
  );
  return rows;
};

export const getStudentRecentActivities = async (studentId, limit = 10) => {
  const [rows] = await db.sequelize.query(
    `SELECT l.* 
     FROM activity_logs l
     WHERE l.user_id = ?
     ORDER BY l.created_at DESC
     LIMIT ?`,
    { replacements: [studentId, Number(limit)] }
  );
  return rows;
};

export const getStudentGoals = async (studentId) => {
  const [rows] = await db.sequelize.query(
    "SELECT * FROM goals WHERE student_id = ? ORDER BY created_at DESC",
    { replacements: [studentId] }
  );
  return rows;
};
