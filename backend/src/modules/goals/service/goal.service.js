import * as repo from "../repository/goal.repository.js";

export const createGoal = async (data) => {
  const goalId = await repo.createGoal(data);
  return { goalId };
};

export const updateGoal = async (id, data, studentId) => {
  const goal = await repo.findGoalById(id);
  if (!goal) throw new Error("Goal not found");
  if (goal.student_id !== studentId) throw new Error("Unauthorized");
  
  await repo.updateGoal(id, data);
  return { message: "Goal updated successfully" };
};

export const deleteGoal = async (id, studentId) => {
  const goal = await repo.findGoalById(id);
  if (!goal) throw new Error("Goal not found");
  if (goal.student_id !== studentId) throw new Error("Unauthorized");

  await repo.deleteGoal(id);
  return { message: "Goal deleted successfully" };
};

export const getGoalsByStudent = async (studentId) => {
  return await repo.findGoalsByStudent(studentId);
};

export const getGoalById = async (id, studentId) => {
  const goal = await repo.findGoalById(id);
  if (!goal) throw new Error("Goal not found");
  if (goal.student_id !== studentId) throw new Error("Unauthorized");
  return goal;
};

export const markGoalComplete = async (id, studentId) => {
  const goal = await repo.findGoalById(id);
  if (!goal) throw new Error("Goal not found");
  if (goal.student_id !== studentId) throw new Error("Unauthorized");

  await repo.markGoalComplete(id);
  return { message: "Goal marked as complete" };
};
