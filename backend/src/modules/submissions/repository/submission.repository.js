import db from "../../../database/index.js";

export const createSubmission = async (data) => {
  const { assignment_id, student_id, file_path, content, status } = data;
  const [submission] = await db.models.submissions.upsert({
    assignment_id, student_id, file_path, content, status, submitted_at: new Date()
  });
  return submission.id;
};

export const findSubmissionsByAssignment = async (assignmentId) => {
  const submissions = await db.models.submissions.findAll({
    where: { assignment_id: assignmentId },
    include: [
      { model: db.models.users, as: 'student', attributes: ['username', 'email'] },
      { model: db.models.grades, as: 'grade', attributes: ['score', 'feedback'] }
    ]
  });
  return submissions.map(s => {
    const data = s.toJSON();
    return {
      ...data,
      student_name: data.student?.username,
      student_email: data.student?.email,
      score: data.grade?.score,
      feedback: data.grade?.feedback
    };
  });
};

export const findSubmissionsByStudent = async (studentId) => {
  const submissions = await db.models.submissions.findAll({
    where: { student_id: studentId },
    include: [
      { model: db.models.assignments, as: 'assignment', attributes: ['title', 'due_date'] },
      { model: db.models.grades, as: 'grade', attributes: ['score', 'feedback'] }
    ]
  });
  return submissions.map(s => {
    const data = s.toJSON();
    return {
      ...data,
      assignment_title: data.assignment?.title,
      due_date: data.assignment?.due_date,
      score: data.grade?.score,
      feedback: data.grade?.feedback
    };
  });
};

export const findAssignmentById = async (id) => {
  return await db.models.assignments.findByPk(id, { raw: true });
};

export const updateStatus = async (id, status) => {
  await db.models.submissions.update({ status }, { where: { id } });
};
