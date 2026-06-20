"use client";

import { useAuth } from '@/context/AuthContext';
import AssignmentManager from '@/components/features/assignments/TeacherAssignmentManager';
import AssignmentView from '@/components/features/assignments/AssignmentView';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AssignmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-400">Loading assignments...</div>;
  }

  if (user.role === 'teacher') {
    return <AssignmentManager />;
  }

  return <AssignmentView />;
}
