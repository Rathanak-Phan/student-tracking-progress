import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export const useDashboard = (role: 'student' | 'teacher' | 'admin') => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard/${role}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to load ${role} dashboard`);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
