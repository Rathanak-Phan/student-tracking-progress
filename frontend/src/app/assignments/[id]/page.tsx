"use client";

import { useAuth } from '@/context/AuthContext';
import GradingPanel from '@/components/features/assignments/GradingPanel';
import AssignmentDetail from '@/components/features/assignments/AssignmentDetail';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AssignmentIdPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-400">Loading assignment...</div>;
  }

  if (user.role === 'teacher' || user.role === 'admin') {
    return <GradingPanel assignmentId={id} />;
  }

  return <AssignmentDetail id={id} />;
}
