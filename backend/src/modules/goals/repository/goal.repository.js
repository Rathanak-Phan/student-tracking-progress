import db from "../../../database/index.js";

export const createGoal = async (data) => {
  const { student_id, title, target_date, target_value, type, assignment_id, progress } = data;
  const goal = await db.models.goals.create({
    student_id, title, target_date, 
    target_value: target_value || 100, 
    type: type || 'grade', 
    status: 'pending', 
    assignment_id: assignment_id || null, 
    progress: progress || 0
  });
  return goal.id;
};

export const updateGoal = async (id, data) => {
  const { title, target_date, target_value, current_value, type, status, assignment_id, progress } = data;
  await db.models.goals.update({
    title, target_date, target_value, current_value, type, status, assignment_id, progress
  }, { where: { id } });
};

export const deleteGoal = async (id) => {
  await db.models.goals.destroy({ where: { id } });
};

export const findGoalsByStudent = async (studentId) => {
  const goals = await db.models.goals.findAll({
    where: { student_id: studentId },
    include: [{ model: db.models.assignments, as: 'assignment', attributes: ['title'] }],
    order: [['created_at', 'DESC']]
  });
  return goals.map(g => {
    const data = g.toJSON();
    return { ...data, assignment_title: data.assignment?.title };
  });
};

export const findGoalById = async (id) => {
  return await db.models.goals.findByPk(id, { raw: true });
};

export const markGoalComplete = async (id) => {
  await db.models.goals.update(
    { status: 'completed', progress: 100 },
    { where: { id } }
  );
};
