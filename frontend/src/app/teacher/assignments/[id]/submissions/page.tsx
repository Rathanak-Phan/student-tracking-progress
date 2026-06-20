"use client";

import { useParams } from 'next/navigation';
import GradingPanel from '@/components/features/assignments/GradingPanel';

export default function SubmissionsPage() {
  const params = useParams();
  const id = params.id as string;

  return <GradingPanel assignmentId={id} />;
}
