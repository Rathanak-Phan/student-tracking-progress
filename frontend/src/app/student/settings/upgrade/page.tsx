"use client";

import { useEffect, useState } from 'react';
import MultiStepRequestForm from '@/components/features/verification/MultiStepRequestForm';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';

export default function UpgradeSettingsPage() {
  const { user, syncSession } = useAuth();
  const router = useRouter();
  const [requestStatus, setRequestStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navItems = useNavItems('student');

  const fetchStatus = async () => {
    try {
      await syncSession(); // Always fetch the latest role from the database first
      const res = await api.get('/teacher-requests/me');
      setRequestStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading status...</div>;

  const isPending = requestStatus?.status === 'pending';
  const isApproved = requestStatus?.status === 'approved' && user?.role === 'teacher';
  const isRevoked = requestStatus?.status === 'approved' && user?.role === 'student';
  const isRejected = requestStatus?.status === 'rejected' || isRevoked;

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Instructor Upgrade</h1>
        <p className="text-gray-500 mt-2 text-sm">Submit your qualifications to become a verified teacher on the platform.</p>
      </div>

      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center flex flex-col items-center">
          <div className="p-4 bg-yellow-100 rounded-full mb-4 text-yellow-600">
            <ClockIcon className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-yellow-900 mb-2">Application Under Review</h2>
          <p className="text-yellow-700 text-sm max-w-md mx-auto">Your verification request is currently being reviewed by the admin team. We will notify you once a decision has been made.</p>
        </div>
      )}

      {isApproved && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center">
          <div className="p-4 bg-green-100 rounded-full mb-4 text-green-600">
            <ShieldCheckIcon className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-green-900 mb-2">You are Approved!</h2>
          <p className="text-green-700 text-sm max-w-md mx-auto mb-6">Congratulations! You have been verified as a teacher. You can now access the Instructor Portal.</p>
          <button 
            onClick={async () => {
              await syncSession();
              window.location.href = '/teacher';
            }} 
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-colors"
          >
            Go to Instructor Portal
          </button>
        </div>
      )}

      {(!requestStatus || requestStatus.status === 'none' || isRejected) && (
        <>
          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
                <XCircleIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Application Rejected</h3>
                <p className="text-red-700 text-sm mt-1">
                  <strong>Reason:</strong> {isRevoked ? "Your instructor privileges were manually revoked by an administrator." : requestStatus.admin_note}
                </p>
                <p className="text-red-600 text-xs mt-3 font-semibold">You may submit a new application below.</p>
              </div>
            </div>
          )}
          <MultiStepRequestForm onSuccess={fetchStatus} />
        </>
      )}
      </div>
    </DashboardLayout>
  );
}
