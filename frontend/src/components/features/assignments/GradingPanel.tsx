"use client";

import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChevronLeftIcon,
  DocumentIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Modal from '@/components/ui/Modal';
import DialogModal from '@/components/ui/DialogModal';
import Link from 'next/link';
import { assignmentService, Assignment, Submission } from '../../../services/assignmentService';
import { useNavItems } from '@/hooks/useNavItems';
import { useAuth } from '@/context/AuthContext';

const GradingPanel = ({ assignmentId }: { assignmentId: string }) => {
  const navItems = useNavItems();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string }>({
    open: false, type: 'error', title: '', message: ''
  });

  const isArchived = assignment?.class_is_active === 0 || assignment?.class_is_active === false;

  const renderContentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">{part}</a>;
      }
      return part;
    });
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      const [assignmentData, submissionsData] = await Promise.all([
        assignmentService.getAssignmentDetails(assignmentId),
        assignmentService.getSubmissions(assignmentId)
      ]);
      setAssignment(assignmentData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGrading = (sub: any) => {
    setSelectedSubmission(sub);
    setGrade(sub.score ? sub.score.toString() : '');
    setFeedback(sub.feedback || '');
    setIsModalOpen(true);
  };

  const handleGrade = async () => {
    if (!selectedSubmission || !grade) return;
    
    setSubmitting(true);
    try {
      await assignmentService.gradeSubmission({
        submission_id: selectedSubmission.id,
        score: parseFloat(grade),
        feedback: feedback
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setDialog({ open: true, type: 'error', title: 'Grading Failed', message: 'Failed to submit grade. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title={user?.role === 'admin' ? "Admin Portal" : "Instructor Portal"}>
      <div className="mb-8">
        <Link href={user?.role === 'admin' ? "/admin/assignments" : "/teacher/assignments"} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline mb-4 w-fit">
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Assignments
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Assignment Submissions</h1>
              {isArchived && (
                <span className="bg-gray-500 text-white px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-lg shadow-gray-100">
                  Archived Class
                </span>
              )}
            </div>
            <p className="text-gray-500 font-medium">{assignment ? `${assignment.title} • Max ${assignment.max_score} pts` : 'Loading assignment...'}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-md border border-gray-100 shadow-sm text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Submissions</p>
              <p className="text-xl font-black text-gray-800">{submissions.length}</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-md border border-gray-100 shadow-sm text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Graded</p>
              <p className="text-xl font-black text-green-600">{submissions.filter(s => s.status === 'graded').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold">Loading submissions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-100">
                          {sub.student_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{sub.student_name}</p>
                          <p className="text-xs text-gray-400">{sub.student_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-700">{new Date(sub.submitted_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(sub.submitted_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider
                        ${sub.status === 'graded' ? 'bg-green-100 text-green-700' : 
                          sub.status === 'late' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {sub.status === 'graded' ? (
                        <p className="font-black text-gray-800 text-lg">{sub.score}<span className="text-gray-300 text-sm font-bold ml-1">/ {assignment?.max_score}</span></p>
                      ) : (
                        <p className="text-gray-300 font-bold text-sm">--</p>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {sub.file_path && (
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5002'}${sub.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-gray-50 text-gray-400 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                            title="View File"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </a>
                        )}
                        {!isArchived && (
                          <button 
                            onClick={() => handleOpenGrading(sub)}
                            className="px-4 py-2.5 bg-gray-900 text-white rounded-md text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-100 flex items-center gap-2"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 font-bold">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                           <ClipboardIcon className="h-8 w-8" />
                        </div>
                        <p>No submissions yet for this assignment</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Grade: ${selectedSubmission?.student_name}`}
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {selectedSubmission.file_path && (
              <div className="bg-gray-50 rounded-md p-5 border border-dashed border-gray-200 flex items-center gap-4">
                 <div className="h-12 w-12 bg-white rounded-md shadow-sm flex items-center justify-center text-blue-600">
                    <DocumentIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{selectedSubmission.file_path.split('/').pop()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SUBMITTED FILE</p>
                  </div>
                  <a 
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5002'}${selectedSubmission.file_path}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ArrowDownTrayIcon className="h-3 w-3" />
                    Download
                  </a>
              </div>
            )}
            
            {selectedSubmission.content && (
              <div className="bg-gray-50 rounded-md p-5 border border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">TEXT SUBMISSION / LINK</p>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">{renderContentWithLinks(selectedSubmission.content)}</div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Score (max {assignment?.max_score})</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full px-5 py-4 rounded-md border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xl bg-gray-50/30"
                  placeholder="0.00"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  max={assignment?.max_score}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">
                  / {assignment?.max_score}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Feedback to Student</label>
              <textarea 
                className="w-full px-5 py-5 rounded-md border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[140px] bg-gray-50/30 leading-relaxed"
                placeholder="Provide constructive feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3">
               <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-4 rounded-md bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleGrade}
                disabled={submitting}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-md font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    Save Grade & Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Dialog Modal for alerts */}
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

export default GradingPanel;
