"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { ShieldCheckIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AdminReviewModal from '@/components/features/verification/AdminReviewModal';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';

export default function VerificationDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const navItems = useNavItems('admin');

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/teacher-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <DashboardLayout navItems={navItems} title="Admin Portal">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Verification Queue</h1>
        <p className="text-gray-500 mt-2 text-sm">Review and manage pending teacher upgrade applications.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
            {requests.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse font-medium">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <ShieldCheckIcon className="h-16 w-16 text-gray-200 mb-4" />
            <h3 className="font-bold text-gray-900 text-lg">All Caught Up!</h3>
            <p className="text-gray-500 text-sm mt-1">There are no pending verification requests at the moment.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Education</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                        {req.avatar_url ? <img src={req.avatar_url} className="w-full h-full object-cover" /> : req.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{req.first_name ? `${req.first_name} ${req.last_name}` : req.username}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{req.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{req.degree}</p>
                    <p className="text-[10px] text-gray-500 truncate w-48">{req.university}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">
                      {req.experience_years} Years
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium text-xs">
                    {format(new Date(req.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 text-xs font-bold rounded-lg shadow-sm transition-all"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedRequest && (
        <AdminReviewModal 
          request={selectedRequest} 
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)} 
          onSuccess={() => { setSelectedRequest(null); fetchRequests(); }}
        />
      )}
    </DashboardLayout>
  );
}
