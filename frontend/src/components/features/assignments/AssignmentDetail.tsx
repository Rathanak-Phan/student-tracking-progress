"use client";

import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ClockIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { assignmentService, Assignment, Submission } from '@/services/assignmentService';
import { useAuth } from '@/context/AuthContext';
import { useNavItems } from '@/hooks/useNavItems';
import DialogModal from '@/components/ui/DialogModal';
import Link from 'next/link';

const AssignmentDetail = ({ id }: { id: string }) => {
  const navItems = useNavItems();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string }>({
    open: false, type: 'error', title: '', message: ''
  });

  const isArchived = assignment?.class_is_active === 0 || assignment?.class_is_active === false;

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [assignmentData, submissionsData] = await Promise.all([
        assignmentService.getAssignmentDetails(id),
        assignmentService.getSubmissions(id)
      ]);
      setAssignment(assignmentData);
      setSubmissions(submissionsData);
      
      if (user) {
        const found = submissionsData.find((s: Submission) => Number(s.student_id) === user.id);
        setMySubmission(found || null);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !assignment) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('assignment_id', assignment.id);
      formData.append('file', file);

      await assignmentService.submitAssignment(formData);
      setFile(null);
      await fetchData();
      setDialog({ open: true, type: 'success', title: 'Submitted!', message: 'Your assignment has been submitted successfully.' });
    } catch (error) {
      setDialog({ open: true, type: 'error', title: 'Submission Failed', message: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Loading assignment details...</div>;
  if (!assignment) return <div className="p-20 text-center font-bold text-gray-400">Assignment not found</div>;

  const getCountdown = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return "Overdue";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m left`;
  };

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/student/assignments" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline mb-8 w-fit">
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Assignments
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Assignment Info */}
            <div className="bg-white rounded-md p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${isArchived ? 'bg-gray-500 text-white shadow-gray-100' : 'bg-blue-50 text-blue-600'}`}>
                      {assignment.class_name || 'Assignment'}
                    </span>
                    {isArchived && (
                      <span className="bg-gray-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-gray-100">
                        Archived
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{assignment.title}</h1>
                </div>
                <div className="text-right bg-gray-50 px-6 py-3 rounded-md border border-gray-100">
                  <p className="text-2xl font-black text-gray-900 leading-none">{assignment.max_score}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Points Possible</p>
                </div>
              </div>

              <div className="prose prose-blue max-w-none text-gray-600 mb-10 leading-relaxed">
                <p className="whitespace-pre-wrap">{assignment.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-8 p-6 bg-gray-50/50 rounded-md border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-md shadow-sm text-blue-600 border border-blue-50">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</p>
                    <p className="font-bold text-gray-800">{new Date(assignment.due_date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Remaining</p>
                  <p className={`font-black ${getCountdown(assignment.due_date) === 'Overdue' ? 'text-red-500' : 'text-blue-600'}`}>
                    {getCountdown(assignment.due_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission History */}
            <div className="bg-white rounded-md p-10 shadow-sm border border-gray-100">
               <h3 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">Submission History</h3>
               {mySubmission ? (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="border-b border-gray-50">
                         <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">File</th>
                         <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                         <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Grade</th>
                         <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Submitted At</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       <tr>
                         <td className="py-6">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                               <DocumentIcon className="h-5 w-5" />
                             </div>
                             <span className="text-sm font-bold text-gray-700 truncate max-w-[150px]">
                               {mySubmission.file_path.split('/').pop()}
                             </span>
                             <a 
                              href={`${process.env.NEXT_PUBLIC_API_URL}${mySubmission.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                             >
                               <ArrowDownTrayIcon className="h-4 w-4" />
                             </a>
                           </div>
                         </td>
                         <td className="py-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                              ${mySubmission.status === 'graded' ? 'bg-green-100 text-green-700' : 
                                mySubmission.status === 'late' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {mySubmission.status}
                            </span>
                         </td>
                         <td className="py-6 text-center">
                            {(mySubmission).score !== undefined ? (
                              <p className="font-black text-gray-800">{(mySubmission).score} / {assignment.max_score}</p>
                            ) : (
                              <p className="text-gray-300 font-bold text-xs">Waiting for grade</p>
                            )}
                         </td>
                         <td className="py-6 text-right">
                           <p className="text-sm font-bold text-gray-700">{new Date(mySubmission.submitted_at).toLocaleDateString()}</p>
                           <p className="text-[10px] text-gray-400 font-bold">{new Date(mySubmission.submitted_at).toLocaleTimeString()}</p>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                   
                   {(mySubmission).feedback && (
                     <div className="mt-8 p-6 bg-blue-50/50 rounded-md border border-blue-100 flex gap-4">
                        <InformationCircleIcon className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Teacher Feedback</p>
                          <p className="text-sm text-blue-900 leading-relaxed font-medium">{(mySubmission).feedback}</p>
                        </div>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="py-12 text-center text-gray-400 font-bold bg-gray-50/30 rounded-md border-2 border-dashed border-gray-100">
                    <p>You haven't submitted this assignment yet.</p>
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-4">
            {!isArchived ? (
              <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100 sticky top-8">
                <h3 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight">
                  {mySubmission ? 'Resubmit Assignment' : 'Submit Work'}
                </h3>
                
                <form onSubmit={handleFileUpload} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-100 rounded-md p-8 text-center hover:border-blue-500 transition-all group relative bg-gray-50/30">
                    {!file ? (
                      <label className="cursor-pointer block py-4">
                        <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-300 group-hover:text-blue-500 transition-colors mb-4" />
                        <p className="text-xs font-bold text-gray-500">Drag or click to upload</p>
                        <p className="text-[10px] text-gray-400 mt-1">PDF, DOCX, ZIP (Max 10MB)</p>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-4 bg-white p-4 rounded-md text-left border border-blue-100 shadow-sm">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-md">
                          <DocumentIcon className="h-6 w-6 shrink-0" />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-black text-gray-800 truncate">{file.name}</p>
                          <p className="text-[10px] font-bold text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFile(null)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={!file || submitting}
                    className={`w-full py-5 rounded-md bg-gray-900 text-white font-black transition-all shadow-xl shadow-gray-200 text-sm uppercase tracking-widest
                      ${(!file || submitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-blue-200 active:scale-95'}`}
                  >
                    {submitting ? 'Processing...' : mySubmission ? 'Resubmit Assignment' : 'Submit Assignment'}
                  </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                      ${mySubmission ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'}`}>
                      <CheckCircleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                      <p className="text-sm font-bold text-gray-800">
                        {mySubmission ? (mySubmission.status === 'graded' ? 'Graded' : 'Submitted') : 'Not Submitted'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100 sticky top-8 text-center border-t-4 border-t-gray-400">
                 <DocumentIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-black text-gray-800 mb-2 uppercase tracking-tight">Archived Class</h3>
                 <p className="text-gray-500 font-medium text-sm">This assignment belongs to an archived class. Submissions are no longer accepted.</p>
                 <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                      ${mySubmission ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'}`}>
                      <CheckCircleIcon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                      <p className="text-sm font-bold text-gray-800">
                        {mySubmission ? (mySubmission.status === 'graded' ? 'Graded' : 'Submitted') : 'Not Submitted'}
                      </p>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      <DialogModal
        isOpen={dialog.open}
        onClose={() => setDialog(d => ({ ...d, open: false }))}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        confirmText="OK"
      />
    </DashboardLayout>
  );
};

export default AssignmentDetail;
