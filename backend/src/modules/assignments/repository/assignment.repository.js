import db from "../../../database/index.js";

// Assignments
export const createAssignment = async (data) => {
  const { class_id, title, description, available_from, due_date, max_score, submission_type } = data;
  const assignment = await db.models.assignments.create({
    class_id, title, description, available_from, due_date, max_score, submission_type
  });
  return assignment.id;
};

export const updateAssignment = async (id, data) => {
  const { title, description, available_from, due_date, max_score, submission_type } = data;
  await db.models.assignments.update({
    title, description, available_from, due_date, max_score, submission_type
  }, { where: { id } });
};

export const deleteAssignment = async (id) => {
  await db.models.assignments.destroy({ where: { id } });
};

export const findAssignmentsByClass = async (classId) => {
  return await db.models.assignments.findAll({
    where: { class_id: classId },
    order: [['created_at', 'DESC']],
    raw: true
  });
};

export const findAssignmentById = async (id) => {
  const assignment = await db.models.assignments.findByPk(id, {
    include: [{ model: db.models.classes, as: 'class', attributes: ['name'] }]
  });
  if (!assignment) return null;
  const data = assignment.toJSON();
  return { ...data, class_name: data.class?.name };
};

export const findAssignmentsForTeacher = async (teacherId) => {
  const assignments = await db.models.assignments.findAll({
    include: [{
      model: db.models.classes,
      as: 'class',
      where: { teacher_id: teacherId },
      attributes: ['name']
    }],
    attributes: {
      include: [
        [db.sequelize.literal(`(SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = assignments.id)`), 'submission_count'],
        [db.sequelize.literal(`(SELECT COUNT(*) FROM enrollments e WHERE e.class_id = assignments.class_id AND e.status = 'active')`), 'total_students']
      ]
    },
    order: [['due_date', 'DESC']]
  });
  return assignments.map(a => {
    const data = a.toJSON();
    return { ...data, class_name: data.class?.name };
  });
};

export const findAssignmentsForStudent = async (studentId) => {
  const assignments = await db.models.assignments.findAll({
    where: {
      [db.Sequelize.Op.or]: [
        { available_from: null },
        { available_from: { [db.Sequelize.Op.lte]: new Date() } }
      ]
    },
    include: [{
      model: db.models.classes,
      as: 'class',
      required: true,
      attributes: ['name'],
      include: [{
        model: db.models.enrollments,
        as: 'enrollments',
        required: true,
        where: { student_id: studentId, status: 'active' },
        attributes: []
      }]
    }],
    attributes: {
      include: [
        [
          db.sequelize.literal(`CASE 
            WHEN (SELECT id FROM grades g WHERE g.submission_id = (SELECT id FROM submissions s WHERE s.assignment_id = assignments.id AND s.student_id = ${db.sequelize.escape(studentId)} LIMIT 1) LIMIT 1) IS NOT NULL THEN 'Graded'
            WHEN (SELECT id FROM submissions s WHERE s.assignment_id = assignments.id AND s.student_id = ${db.sequelize.escape(studentId)} LIMIT 1) IS NOT NULL THEN 'Submitted'
            ELSE 'Pending'
          END`),
          'status'
        ],
        [
          db.sequelize.literal(`(SELECT score FROM grades g WHERE g.submission_id = (SELECT id FROM submissions s WHERE s.assignment_id = assignments.id AND s.student_id = ${db.sequelize.escape(studentId)} LIMIT 1) LIMIT 1)`),
          'grade'
        ]
      ]
    },
    order: [['due_date', 'DESC']]
  });
  return assignments.map(a => {
    const data = a.toJSON();
    return { ...data, class_name: data.class?.name };
  });
};

export const findAllAssignments = async () => {
  const [rows] = await db.sequelize.query(
    `SELECT a.*, c.name as class_name, u.username as teacher_name,
     (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submitted_count,
     (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id AND (s.status = 'late' OR s.submitted_at > a.due_date)) as late_count,
     (SELECT COUNT(*) FROM enrollments e WHERE e.class_id = a.class_id AND e.status = 'active') as total_students
     FROM assignments a
     JOIN classes c ON a.class_id = c.id
     JOIN users u ON c.teacher_id = u.id
     ORDER BY a.created_at DESC`
  );
  return rows;
};
