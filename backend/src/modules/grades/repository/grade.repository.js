import db from "../../../database/index.js";

export const createGrade = async ({ submission_id, score, feedback }) => {
  const [grade] = await db.models.grades.upsert({
    submission_id, score, feedback, graded_at: new Date()
  });
  return grade.id;
};

export const findBySubmissionId = async (submissionId) => {
  return await db.models.grades.findOne({
    where: { submission_id: submissionId },
    raw: true
  });
};

export const checkSubmissionExists = async (submissionId) => {
    const count = await db.models.submissions.count({ where: { id: submissionId } });
    return count > 0;
}

export const findTeacherBySubmissionId = async (submissionId) => {
    const submission = await db.models.submissions.findByPk(submissionId, {
        include: [{
            model: db.models.assignments,
            as: 'assignment',
            include: [{
                model: db.models.classes,
                as: 'class'
            }]
        }]
    });

    if (!submission) return null;

    return {
        teacher_id: submission.assignment.class.teacher_id,
        max_score: submission.assignment.max_score,
        student_id: submission.student_id,
        assignment_title: submission.assignment.title
    };
};
