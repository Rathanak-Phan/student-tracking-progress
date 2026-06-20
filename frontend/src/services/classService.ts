import api from '../lib/axios';

export interface Class {
  id: number;
  name: string;
  name: string;
  description?: string;
  code: string;
  teacherId: number;
  cover_image?: string;
}

export interface PendingRequest {
  id: number;
  student_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const classService = {
  getAll: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    // If it's FormData, it will be sent correctly, but let's handle the Content-Type automatically by not explicitly setting it for axios so it can boundary it
    const response = await api.post('/classes', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  join: async (code: string) => {
    const response = await api.post('/classes/join', { code });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  getEnrolledStudents: async (id: number) => {
    const response = await api.get(`/classes/${id}/students`);
    return response.data;
  },

  getTeacherClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getStudentClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getPendingRequests: async (classId: number) => {
    const response = await api.get(`/classes/${classId}/join-requests`);
    return response.data;
  },

  approvePendingRequest: async (classId: number, requestId: number) => {
    const response = await api.post(`/classes/${classId}/join-requests/${requestId}/approve`);
    return response.data;
  },

  rejectPendingRequest: async (classId: number, requestId: number) => {
    const response = await api.post(`/classes/${classId}/join-requests/${requestId}/reject`);
    return response.data;
  }
};
