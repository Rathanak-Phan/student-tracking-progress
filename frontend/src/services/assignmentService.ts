import api from '../lib/axios';

export interface Assignment {
  id: string;
  class_id: string;
  title: string;
  description: string;
  due_date: string;
  available_from?: string;
  max_score: number;
  status?: string;
  grade?: number;
  class_name?: string;
  submission_count?: number;
  class_is_active?: number | boolean;
  submission_type?: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_path: string;
  status: string;
  submitted_at: string;
  student_name?: string;
  student_email?: string;
  score?: number;
  feedback?: string;
  content?: string;
}

export const assignmentService = {
  getAssignmentsByClass: async (classId: string) => {
    const response = await api.get(`/assignments?class_id=${classId}`);
    return response.data;
  },

  getAdminAssignments: async () => {
    const response = await api.get('/admin/assignments');
    return response.data;
  },

  getMyAssignments: async () => {
    const response = await api.get('/assignments/me');
    return response.data;
  },

  getAssignmentDetails: async (id: string) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (data: any) => {
    const response = await api.post('/assignments', data);
    return response.data;
  },

  updateAssignment: async (id: string, data: any) => {
    const response = await api.put(`/assignments/${id}`, data);
    return response.data;
  },

  deleteAssignment: async (id: string) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  getSubmissions: async (assignmentId: string) => {
    const response = await api.get(`/submissions?assignment_id=${assignmentId}`);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/submissions/me');
    return response.data;
  },

  gradeSubmission: async (data: { submission_id: string; score: number; feedback: string }) => {
    const response = await api.post('/grades', data);
    return response.data;
  },

  submitAssignment: async (formData: FormData) => {
    const response = await api.post('/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

