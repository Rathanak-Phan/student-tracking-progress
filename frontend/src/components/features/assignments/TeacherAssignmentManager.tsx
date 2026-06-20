"use client";

import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { assignmentService, Assignment } from '@/services/assignmentService';
import { classService } from '@/services/classService';
import Modal from '@/components/ui/Modal';
import DialogModal from '@/components/ui/DialogModal';
import Link from 'next/link';
import { useNavItems } from '@/hooks/useNavItems';

const AssignmentManager = () => {
  const navItems = useNavItems();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    available_from: '',
    due_date: '',
    max_score: 100,
    class_id: '',
    submission_type: 'file'
  });

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; type: 'error' | 'confirm'; title: string; message: string; onConfirm?: () => void }>({
    open: false, type: 'error', title: '', message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsData, classesData] = await Promise.all([
        assignmentService.getMyAssignments(),
        classService.getTeacherClasses()
      ]);
      setAssignments(assignmentsData);
      setClasses(classesData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (assignment: Assignment | null = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title,
        description: assignment.description || '',
        available_from: assignment.available_from ? new Date(assignment.available_from).toISOString().slice(0, 16) : '',
        due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '',
        max_score: assignment.max_score,
        class_id: assignment.class_id,
        submission_type: assignment.submission_type || 'file'
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        available_from: '',
        due_date: '',
        max_score: 100,
        class_id: activeClasses[0]?.id || '',
        submission_type: 'file'
      });
    }
    setIsModalOpen(true);
  };

  const activeClasses = classes.filter(c => c.is_active !== 0 && c.is_active !== false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment.id, formData);
      } else {
        await assignmentService.createAssignment(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setDialog({ open: true, type: 'error', title: 'Save Failed', message: 'Failed to save assignment. Please try again.' });
    }
  };

  const handleDelete = (id: string) => {
    setDialog({
      open: true,
      type: 'confirm',
      title: 'Delete Assignment',
      message: 'Are you sure you want to delete this assignment? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await assignmentService.deleteAssignment(id);
          fetchData();
        } catch (error) {
          setDialog({ open: true, type: 'error', title: 'Delete Failed', message: 'Failed to delete assignment. Please try again.' });
        }
      }
    });
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.class_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getDeadlineStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { label: 'Overdue', color: 'text-red-600 bg-red-50' };
    if (days === 0) return { label: 'Due Today', color: 'text-orange-600 bg-orange-50' };
    if (days <= 3) return { label: `${days} days left`, color: 'text-amber-600 bg-amber-50' };
    return { label: `${days} days left`, color: 'text-blue-600 bg-blue-50' };
  };

  return (
    <DashboardLayout navItems={navItems} title="Instructor Portal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-gray-500 font-medium">Create and track student submissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold"
        >
          <PlusIcon className="h-5 w-5" />
          New Assignment
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full pl-12 pr-4 py-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold">Loading assignments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Assignment</th>
                  <th className="px-8 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Class</th>
                  <th className="px-8 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Due Date</th>
                  <th className="px-8 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Progress</th>
                  <th className="px-8 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAssignments.map((item) => {
                  const deadline = getDeadlineStatus(item.due_date);
                  const progress = item.total_students ? (item.submission_count || 0) / item.total_students : 0;
                  
                  return (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Max Score: {item.max_score}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-gray-600">{item.class_name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <ClockIcon className="h-4 w-4" />
                            {new Date(item.due_date).toLocaleDateString()}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${deadline.color}`}>
                            {deadline.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5 w-32">
                          <div className="flex justify-between text-[10px] font-black text-gray-500">
                            <span>{item.submission_count}/{item.total_students}</span>
                            <span>{Math.round(progress * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${progress === 1 ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${progress * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link 
                            href={`/teacher/assignments/${item.id}/submissions`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Submissions"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </Link>
                          {(item.class_is_active !== 0 && item.class_is_active !== false) && (
                            <>
                              <button 
                                onClick={() => handleOpenModal(item)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? "Edit Assignment" : "New Assignment"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Class</label>
            <select 
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.class_id}
              onChange={(e) => setFormData({...formData, class_id: e.target.value})}
              required
            >
              {activeClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              placeholder="e.g. Calculus Midterm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-32"
              placeholder="Assignment details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Appear Time</label>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, available_from: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)})}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-md"
                >
                  Now
                </button>
              </div>
              <input 
                type="datetime-local" 
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.available_from}
                onChange={(e) => {
                  setFormData({...formData, available_from: e.target.value});
                  e.target.blur();
                }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Due Date & Time</label>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, due_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)})}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-md"
                >
                  Now
                </button>
              </div>
              <input 
                type="datetime-local" 
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.due_date}
                onChange={(e) => {
                  setFormData({...formData, due_date: e.target.value});
                  e.target.blur();
                }}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Max Points</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.max_score}
                onChange={(e) => setFormData({...formData, max_score: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Submission Type</label>
              <select 
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.submission_type}
                onChange={(e) => setFormData({...formData, submission_type: e.target.value})}
                required
              >
                <option value="file">File Upload Only</option>
                <option value="text">Text / Link Only</option>
                <option value="both">Both File and Text</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-md border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              {editingAssignment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog Modal for alerts & confirmations */}
      <DialogModal
        isOpen={dialog.open}
        onClose={() => setDialog(d => ({ ...d, open: false }))}
        onConfirm={dialog.onConfirm}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.type === 'confirm' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </DashboardLayout>
  );
};

export default AssignmentManager;
