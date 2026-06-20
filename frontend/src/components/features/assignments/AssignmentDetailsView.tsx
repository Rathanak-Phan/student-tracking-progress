"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  ClockIcon,
  ClipboardIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { assignmentService, Assignment, Submission } from '@/services/assignmentService';
import DialogModal from '@/components/ui/DialogModal';
import { useNavItems } from '@/hooks/useNavItems';

const AssignmentDetailsView = () => {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  const navItems = useNavItems();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Submission state
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditingSubmission, setIsEditingSubmission] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string }>({
    open: false, type: 'error', title: '', message: ''
  });

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      // Fetch all to get the status (Submitted, Graded, Pending) correctly
      const all = await assignmentService.getMyAssignments();
      const found = all.find((a: Assignment) => a.id.toString() === assignmentId);
      if (found) {
        setAssignment(found);
        if (found.status === 'Submitted' || found.status === 'Graded') {
          const mySubmissions = await assignmentService.getMySubmissions();
          const mySub = mySubmissions.find((s: Submission) => s.assignment_id.toString() === assignmentId);
          if (mySub) setSubmission(mySub);
        }
      } else {
        router.push('/student/assignments');
      }
    } catch (error) {
      console.error("Failed to fetch assignment details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    
    const needsFile = assignment.submission_type === 'file' || assignment.submission_type === 'both';
    const needsText = assignment.submission_type === 'text' || assignment.submission_type === 'both';
    
    if (needsFile && assignment.submission_type !== 'both' && !file) return;
    if (needsText && assignment.submission_type !== 'both' && !textContent.trim()) return;
    if (assignment.submission_type === 'both' && !file && !textContent.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('assignment_id', assignment.id.toString());
      if (file) formData.append('file', file);
      if (textContent.trim()) formData.append('content', textContent.trim());

      await assignmentService.submitAssignment(formData);
      setFile(null);
      setTextContent('');
      setIsEditingSubmission(false);
      await fetchAssignment();
      setDialog({ open: true, type: 'success', title: 'Submitted!', message: 'Your assignment has been submitted successfully.' });
    } catch (error) {
      setDialog({ open: true, type: 'error', title: 'Submission Failed', message: 'Failed to submit assignment. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Assignment Details">
        <div className="p-20 text-center text-gray-400 font-bold">Loading details...</div>
      </DashboardLayout>
    );
  }

  if (!assignment) return null;

  const getDeadlineInfo = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { label: 'LATE', color: 'text-red-600' };
    if (days === 0) return { label: 'DUE TODAY', color: 'text-orange-600' };
    return { label: `${days}d left`, color: 'text-blue-600' };
  };

  const deadline = getDeadlineInfo(assignment.due_date);
  const isActive = assignment.class_is_active !== 0 && assignment.class_is_active !== false;
  const isPastDeadline = new Date().getTime() > new Date(assignment.due_date).getTime();

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

  return (
    <DashboardLayout navItems={navItems} title="Assignment Details">
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => router.push('/student/assignments')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">{assignment.class_name} • {assignment.max_score} Points</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-4">Instructions</h3>
            <div className="text-gray-700 whitespace-pre-wrap min-h-[150px]">
              {assignment.description || <span className="italic text-gray-400">No instructions provided.</span>}
            </div>
          </div>

          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-4">
              {assignment.status === 'Submitted' ? 'Update Submission' : assignment.status === 'Graded' ? 'Submission details' : 'Submit Assignment'}
            </h3>
            
            {assignment.status === 'Graded' ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold text-green-800 text-lg">Graded</h4>
                  <p className="text-green-600 font-bold text-lg mt-1 mb-4">Score: {assignment.grade} / {assignment.max_score}</p>
                  
                  {submission?.feedback && (
                    <div className="bg-white rounded-md p-4 text-left border border-green-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Teacher Feedback</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.feedback}</p>
                    </div>
                  )}
                </div>

                {submission && (
                  <div className="bg-white rounded-md p-4 mb-6 text-left border border-gray-200 space-y-4">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2">Your Submission</h4>
                    {submission.file_path && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-md text-blue-600 flex-shrink-0">
                            <DocumentTextIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {submission.file_path.split('/').pop()}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                              Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={`http://localhost:5002${submission.file_path}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 whitespace-nowrap ml-4 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          View File
                        </a>
                      </div>
                    )}
                    
                    {submission.content && (
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Submitted Text/Link</p>
                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                          {renderContentWithLinks(submission.content)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : assignment.status === 'Submitted' && !isEditingSubmission ? (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-8 text-center">
                <CheckCircleIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="font-bold text-blue-900 text-xl">Successfully Submitted</h4>
                <p className="text-blue-600 font-medium text-sm mt-2 mb-6">Your assignment has been submitted and is waiting to be graded.</p>
                
                {submission && (
                  <div className="bg-white rounded-md p-4 mb-6 text-left border border-blue-100 space-y-4">
                    {submission.file_path && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-md text-blue-600 flex-shrink-0">
                            <DocumentTextIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {submission.file_path.split('/').pop()}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                              Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={`http://localhost:5002${submission.file_path}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 whitespace-nowrap ml-4 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          View File
                        </a>
                      </div>
                    )}
                    
                    {submission.content && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Submitted Text/Link:</p>
                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                          {renderContentWithLinks(submission.content)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isActive && !isPastDeadline && (
                  <button 
                    onClick={() => setIsEditingSubmission(true)}
                    className="px-6 py-2.5 rounded-md bg-white border border-blue-200 text-blue-600 font-bold hover:bg-blue-100 transition-colors shadow-sm text-sm w-full mt-2"
                  >
                    Update Submission
                  </button>
                )}
                
                {isActive && isPastDeadline && (
                  <div className="bg-orange-50 border border-orange-100 rounded-md p-4 text-center">
                    <p className="text-xs font-bold text-orange-800 uppercase tracking-widest">Deadline Passed</p>
                    <p className="text-xs text-orange-600 mt-1 font-medium">You can no longer update your submission.</p>
                  </div>
                )}
              </div>
            ) : isActive ? (
              <form onSubmit={handleFileUpload} className="space-y-6">
                {(assignment.submission_type === 'file' || assignment.submission_type === 'both' || !assignment.submission_type) && (
                  <div className="border-2 border-dashed border-gray-200 rounded-md p-10 text-center hover:border-blue-500 transition-colors group">
                    {!file ? (
                      <label className="cursor-pointer">
                        <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-300 group-hover:text-blue-500 transition-colors mb-4" />
                        <p className="text-sm font-bold text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">PDF, DOCX, ZIP (MAX 10MB)</p>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-md text-white">
                            <ClipboardIcon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-blue-900 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-[10px] font-bold text-blue-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFile(null)}
                          className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5 text-blue-400" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {(assignment.submission_type === 'text' || assignment.submission_type === 'both') && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Text Submission / Link</label>
                    <textarea 
                      className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800 font-medium min-h-[120px]"
                      placeholder="Type your answer or paste a link here (e.g. Microsoft Teams link)..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  {isEditingSubmission && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditingSubmission(false);
                        setFile(null);
                        setTextContent('');
                      }}
                      className="w-1/3 px-6 py-4 rounded-md border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit"
                    disabled={(assignment.submission_type === 'file' && !file) || (assignment.submission_type === 'text' && !textContent.trim()) || (assignment.submission_type === 'both' && !file && !textContent.trim()) || submitting}
                    className={`flex-1 px-6 py-4 rounded-md bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-200
                      ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  >
                    {submitting ? 'Submitting...' : 'Confirm Submission'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                <p className="text-gray-500 font-bold">This class is archived. Submissions are no longer accepted.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Status Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="h-5 w-5" />
                  <span className="text-sm font-bold">Due Date</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">{new Date(assignment.due_date).toLocaleDateString()}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${deadline.color}`}>
                    {deadline.label}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                  ${assignment.status === 'Graded' ? 'bg-green-100 text-green-700' : 
                    assignment.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-600'}`}>
                  {assignment.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AssignmentDetailsView;
