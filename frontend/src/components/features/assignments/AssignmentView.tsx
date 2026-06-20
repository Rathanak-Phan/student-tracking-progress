"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { assignmentService, Assignment } from '../../../services/assignmentService';
import Modal from '@/components/ui/Modal';
import DialogModal from '@/components/ui/DialogModal';
import { useNavItems } from '@/hooks/useNavItems';

const AssignmentView = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navItems = useNavItems();
  const router = useRouter();

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string }>({
    open: false, type: 'error', title: '', message: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await assignmentService.getMyAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (assignment: Assignment) => {
    router.push(`/student/assignments/${assignment.id}`);
  };

  const filtered = assignments.filter(a => filter === 'All' || a.status === filter);

  const getDeadlineInfo = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { label: 'LATE', color: 'text-red-600' };
    if (days === 0) return { label: 'DUE TODAY', color: 'text-orange-600' };
    return { label: `${days}d left`, color: 'text-blue-600' };
  };

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <p className="text-gray-500 font-medium">Keep track of your deadlines and submissions</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['All', 'Pending', 'Submitted', 'Graded'].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)}
            className={`px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all
            ${filter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-20 text-center text-gray-400 font-bold">Loading assignments...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {filtered.map((item) => {
              const deadline = getDeadlineInfo(item.due_date);
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleViewDetails(item)}
                  className="bg-white rounded-md p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center group hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex gap-4 items-start mb-4 md:mb-0">
                    <div className={`p-4 rounded-md flex-shrink-0 
                      ${item.status === 'Graded' ? 'bg-green-50 text-green-600' : 
                        item.status === 'Submitted' ? 'bg-blue-50 text-blue-600' : 
                        'bg-gray-50 text-gray-600'}`}>
                      <ClipboardIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">{item.class_name} • {item.max_score} Points</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          {new Date(item.due_date).toLocaleDateString()}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${deadline.color}`}>
                          {deadline.label}
                        </span>
                        {(item.class_is_active === 0 || item.class_is_active === false) && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                    {item.status === 'Graded' ? (
                      <div className="text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                          Grade: {item.grade}/{item.max_score}
                        </span>
                        <div className="flex gap-3 justify-end mt-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleViewDetails(item); }} 
                            className="text-[10px] text-gray-400 font-bold uppercase hover:text-blue-600"
                          >
                            View Feedback
                          </button>
                        </div>
                      </div>
                    ) : item.status === 'Submitted' ? (
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                          Submitted
                        </span>
                        <div className="flex items-center gap-3">
                          {(item.class_is_active !== 0 && item.class_is_active !== false) && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleViewDetails(item); }}
                              className="text-[10px] text-blue-500 font-bold uppercase hover:text-blue-700"
                            >
                              Update File
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        {(item.class_is_active !== 0 && item.class_is_active !== false) ? (
                          <div className="flex flex-row items-center justify-between md:justify-end gap-3 w-full">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleViewDetails(item); }}
                              className="bg-gray-900 text-white px-6 py-2.5 rounded-md text-xs font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                              <CloudArrowUpIcon className="h-4 w-4" />
                              Submit
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-500 uppercase">Not Submitted</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="bg-white rounded-md p-20 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No assignments found for this category</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md p-8 text-white shadow-xl shadow-blue-200 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Summary</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                    <span>Completion Rate</span>
                    <span>{assignments.length ? Math.round((assignments.filter(a => a.status !== 'Pending').length / assignments.length) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${assignments.length ? (assignments.filter(a => a.status !== 'Pending').length / assignments.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-md backdrop-blur-md text-center">
                    <p className="text-2xl font-black">{assignments.filter(a => a.status === 'Pending').length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Pending</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-md backdrop-blur-md text-center">
                    <p className="text-2xl font-black">{assignments.filter(a => a.status !== 'Pending').length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Completed</p>
                  </div>
                </div>
                {assignments.filter(a => a.status === 'Graded').length > 0 && (
                  <div className="bg-white/20 p-5 rounded-md backdrop-blur-md text-center border border-white/10 mt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Earned Score</p>
                    <p className="text-3xl font-black">
                      {assignments.reduce((sum, a) => sum + (a.status === 'Graded' ? Number(a.grade || 0) : 0), 0)}
                      <span className="text-sm opacity-60 ml-1">/ {assignments.reduce((sum, a) => sum + (a.status === 'Graded' ? Number(a.max_score || 0) : 0), 0)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default AssignmentView;
