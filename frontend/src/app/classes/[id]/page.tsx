"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  ClipboardDocumentListIcon, 
  BookOpenIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  UserMinusIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  PhotoIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InviteStudentModal from '@/components/features/classes/InviteStudentModal';
import CreateAssignmentModal from '@/components/features/assignments/CreateAssignmentModal';
import SubmitAssignmentModal from '@/components/features/assignments/SubmitAssignmentModal';
import UploadMaterialModal from '@/components/features/classes/UploadMaterialModal';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

type TabType = 'students' | 'assignments' | 'materials';

export default function ClassDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const navItems = useNavItems();
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabData, setTabData] = useState<any[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isUploadMaterialOpen, setIsUploadMaterialOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState<string>('');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const isArchived = classData?.is_active === 0 || classData?.is_active === false;

  const getAssetUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:5002';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const forceDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  const fetchClassDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/classes/${id}`);
      setClassData(response.data);
    } catch (err) {
      console.error(err);
      router.push('/classes');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const fetchTabData = useCallback(async (tab: TabType) => {
    try {
      setTabLoading(true);
      let endpoint = '';
      if (tab === 'students') endpoint = `/classes/${id}/students`;
      else if (tab === 'assignments') endpoint = `/assignments?class_id=${id}`;
      else if (tab === 'materials') endpoint = `/materials?class_id=${id}`;

      const response = await api.get(endpoint);
      setTabData(response.data);
      
      // Fetch pending requests if viewing students tab and user is teacher
      if (tab === 'students' && (user?.role === 'teacher' || user?.role === 'admin')) {
        fetchPendingRequests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTabLoading(false);
    }
  }, [id, user]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      setPendingLoading(true);
      const response = await api.get(`/classes/${id}/join-requests`);
      setPendingRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingLoading(false);
    }
  }, [id]);

  const handleApproveRequest = async (requestId: number) => {
    try {
      await api.post(`/classes/${id}/join-requests/${requestId}/approve`);
      await fetchPendingRequests();
      await fetchTabData('students');
    } catch (err: any) {
      console.error("Error approving request:", err);
      alert(`Failed to approve request: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await api.post(`/classes/${id}/join-requests/${requestId}/reject`);
      await fetchPendingRequests();
    } catch (err: any) {
      console.error("Error rejecting request:", err);
      alert(`Failed to reject request: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  if (loading) {
    return (
      <DashboardLayout navItems={[]} title="Loading Class...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title={classData?.name || 'Class Details'}>
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 font-bold text-sm uppercase tracking-widest"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Classes
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
           </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-md text-xs font-black tracking-widest uppercase shadow-lg ${isArchived ? 'bg-gray-500 text-white shadow-gray-100' : 'bg-blue-600 text-white shadow-blue-100'}`}>
                {isArchived ? 'Archived Class' : 'Active Class'}
              </span>
              <span className="bg-gray-900 text-white px-4 py-1.5 rounded-md text-xs font-mono font-bold tracking-widest uppercase">
                CODE: {classData?.code}
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">{classData?.name}</h1>
            <p className="text-gray-500 font-medium text-lg max-w-2xl">{classData?.description || 'No description provided for this class.'}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Instructor</p>
                <p className="text-xl font-bold text-gray-800">{classData?.teacher_name}</p>
             </div>
             <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-black text-xl">
                {classData?.teacher_name?.charAt(0)}
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-gray-100 rounded-md mb-8 w-fit shadow-sm">
        {(['students', 'assignments', 'materials'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (activeTab !== tab) {
                setTabLoading(true);
                setActiveTab(tab);
              }
            }}
            className={`px-8 py-3 rounded-md font-bold text-sm transition-all duration-300 flex items-center gap-2
              ${activeTab === tab ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            {tab === 'students' && <UsersIcon className="h-4 w-4" />}
            {tab === 'assignments' && <ClipboardDocumentListIcon className="h-4 w-4" />}
            {tab === 'materials' && <BookOpenIcon className="h-4 w-4" />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {tabLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'students' && (
              <div className="space-y-8">
                {/* Pending Join Requests Section */}
                {(user?.role === 'teacher' || user?.role === 'admin') && (
                  <div className="bg-white rounded-md shadow-sm border border-amber-100 overflow-hidden">
                    <div className="p-6 border-b border-amber-50 bg-amber-50/50">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-amber-500 text-white flex items-center justify-center text-sm">!</div>
                        Pending Join Requests ({pendingRequests.length})
                      </h3>
                    </div>
                    {pendingLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    ) : pendingRequests.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-amber-50/30">
                              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Requested</th>
                              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-50">
                            {pendingRequests.map((request) => (
                              <tr key={request.id} className="group hover:bg-amber-50/30 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold uppercase">
                                      {request.username?.charAt(0) || request.first_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-800">{(request.first_name || '') + ' ' + (request.last_name || '') || request.username}</p>
                                      <p className="text-xs text-gray-400">{request.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {new Date(request.requested_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => handleApproveRequest(request.id)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                      title="Approve"
                                    >
                                      <CheckCircleIcon className="h-5 w-5" />
                                    </button>
                                    <button 
                                      onClick={() => handleRejectRequest(request.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                      title="Reject"
                                    >
                                      <XCircleIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="px-6 py-12 text-center text-gray-400 font-medium">No pending join requests.</div>
                    )}
                  </div>
                )}

                {/* Enrolled Students Section */}
                <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Enrolled Students ({tabData.length})</h3>
                    {(user?.role === 'teacher' || user?.role === 'admin') && !isArchived && (
                      <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Invite Student
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          {(user?.role === 'teacher' || user?.role === 'admin') && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {tabData.length > 0 ? tabData.map((student) => (
                          <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold uppercase">
                                  {student.username?.charAt(0) || student.first_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800">{(student.first_name || '') + ' ' + (student.last_name || '') || student.username}</p>
                                  <p className="text-xs text-gray-400">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(student.enrolled_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-md bg-green-50 text-green-600 text-xs font-bold uppercase tracking-tighter">
                                {student.status || 'Active'}
                              </span>
                            </td>
                            {(user?.role === 'teacher' || user?.role === 'admin') && !isArchived && (
                              <td className="px-6 py-4 text-right">
                                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                  <UserMinusIcon className="h-5 w-5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-medium">No students enrolled yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Assignments</h3>
                  {(user?.role === 'teacher' || user?.role === 'admin') && !isArchived && (
                    <button 
                      onClick={() => setIsCreateAssignmentOpen(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Create Assignment
                    </button>
                  )}
                </div>
                {tabData.length > 0 ? tabData.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-md p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors group">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center">
                        <ClipboardDocumentListIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{assignment.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-400 font-medium">Due: {new Date(assignment.due_date).toLocaleString()}</p>
                          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                          <p className="text-xs text-gray-400 font-medium">Max Score: {assignment.max_score}</p>
                        </div>
                      </div>
                    </div>
                    {(user?.role === 'teacher' || user?.role === 'admin' || (!isArchived && user?.role === 'student')) && (
                      <button 
                        onClick={() => {
                          if (user?.role === 'student') {
                            setSelectedAssignmentId(assignment.id);
                            setSelectedAssignmentTitle(assignment.title);
                          } else {
                            // Handle teacher/admin "Submissions" logic
                            router.push(`/assignments/${assignment.id}`);
                          }
                        }}
                        className="px-6 py-2 rounded-md bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-900 hover:text-white transition-all"
                      >
                        {(user?.role === 'teacher' || user?.role === 'admin') ? 'Submissions' : 'Submit'}
                      </button>
                    )}
                  </div>
                )) : (
                  <div className="bg-white rounded-md p-20 text-center border border-dashed border-gray-200">
                    <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No assignments posted yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Learning Materials</h3>
                  {(user?.role === 'teacher' || user?.role === 'admin') && !isArchived && (
                    <button 
                      onClick={() => setIsUploadMaterialOpen(true)}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Upload Material
                    </button>
                  )}
                </div>
                {tabData.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {tabData.map((material) => {
                      const extension = material.file_url?.split('.').pop()?.toLowerCase();
                      let Icon = DocumentIcon;
                      let colorClass = "bg-gray-50 text-gray-600";
                      
                      if (['pdf'].includes(extension)) {
                        colorClass = "bg-red-50 text-red-600";
                      } else if (['doc', 'docx'].includes(extension)) {
                        colorClass = "bg-blue-50 text-blue-600";
                      } else if (['ppt', 'pptx'].includes(extension)) {
                        colorClass = "bg-orange-50 text-orange-600";
                      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                        Icon = PhotoIcon;
                        colorClass = "bg-purple-50 text-purple-600";
                      } else if (['zip', 'rar'].includes(extension)) {
                        Icon = ArchiveBoxIcon;
                        colorClass = "bg-amber-50 text-amber-600";
                      }

                      return (
                        <div key={material.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors group">
                          <div className="flex items-start gap-4">
                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors text-lg">{material.title}</h4>
                              <p className="text-sm text-gray-500 mt-1 max-w-2xl">{material.description || 'No description provided.'}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-2 py-0.5 rounded-md shadow-sm">
                                  {extension || 'FILE'}
                                </span>
                                {material.uploaded_at && (
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    {new Date(material.uploaded_at).toLocaleDateString()} at {new Date(material.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 md:w-auto w-full">
                            <button 
                              onClick={() => window.open(getAssetUrl(material.file_url), '_blank')}
                              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                              <EyeIcon className="h-4 w-4 text-gray-400" />
                              View
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                forceDownload(getAssetUrl(material.file_url), material.title || 'material');
                              }}
                              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                              Download
                            </button>
                            
                            {(user?.role === 'teacher' || user?.role === 'admin') && !isArchived && (
                              <button className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-1">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-md p-20 text-center border border-dashed border-gray-200">
                    <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No materials shared yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {classData && (
        <InviteStudentModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          classCode={classData.code}
          className={classData.name}
        />
      )}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <CreateAssignmentModal
          isOpen={isCreateAssignmentOpen}
          onClose={() => setIsCreateAssignmentOpen(false)}
          onSuccess={() => fetchTabData('assignments')}
          defaultClassId={id as string}
        />
      )}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <UploadMaterialModal
          isOpen={isUploadMaterialOpen}
          onClose={() => setIsUploadMaterialOpen(false)}
          onSuccess={() => fetchTabData('materials')}
          classId={id as string}
        />
      )}

      {user?.role === 'student' && selectedAssignmentId && (
        <SubmitAssignmentModal
          isOpen={!!selectedAssignmentId}
          onClose={() => {
            setSelectedAssignmentId(null);
            setSelectedAssignmentTitle('');
          }}
          onSuccess={() => fetchTabData('assignments')}
          assignmentId={selectedAssignmentId}
          assignmentTitle={selectedAssignmentTitle}
        />
      )}
    </DashboardLayout>
  );
}
