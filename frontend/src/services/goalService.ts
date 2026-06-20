import api from '../lib/axios';

export interface Goal {
  id?: number;
  title: string;
  target_date: string;
  target_value?: number;
  current_value?: number;
  type: 'grade' | 'assignment' | 'hours' | 'general';
  status?: 'pending' | 'in_progress' | 'completed';
  assignment_id?: number | null;
  progress: number;
  assignment_title?: string;
}

export const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

export const createGoal = async (goal: Goal) => {
  const response = await api.post('/goals', goal);
  return response.data;
};

export const updateGoal = async (id: number, goal: Partial<Goal>) => {
  const response = await api.patch(`/goals/${id}`, goal);
  return response.data;
};

export const deleteGoal = async (id: number) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

export const markGoalComplete = async (id: number) => {
  const response = await api.patch(`/goals/${id}/complete`);
  return response.data;
};
