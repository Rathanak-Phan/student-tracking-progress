"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '@/lib/axios';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: any) => void;
  goal?: any;
}

const GoalModal = ({ isOpen, onClose, onSave, goal }: GoalModalProps) => {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState<number | string>(0);
  const [type, setType] = useState('general');
  const [assignmentId, setAssignmentId] = useState<string | number>('');
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (goal) {
        setTitle(goal.title || '');
        setTargetDate(goal.target_date ? goal.target_date.split('T')[0] : '');
        setProgress(goal.progress || 0);
        setType(goal.type || 'general');
        setAssignmentId(goal.assignment_id || '');
      } else {
        setTitle('');
        setTargetDate(new Date().toISOString().split('T')[0]);
        setProgress(0);
        setType('general');
        setAssignmentId('');
      }
      fetchAssignments();
    }
  }, [isOpen, goal]);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/dashboard/student');
      // Extract assignments from classes
      const allAssignments: any[] = [];
      response.data.classes?.forEach((cls: any) => {
        // This depends on how the dashboard data is structured. 
        // If it doesn't have all assignments, I might need a different endpoint.
        // For now let's assume I can get them or I'll just use a general list.
      });
      const assnRes = await api.get('/assignments/me');
      setAssignments(assnRes.data || []);
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      target_date: targetDate,
      progress: progress === '' ? 0 : Number(progress),
      type,
      assignment_id: assignmentId === '' ? null : parseInt(assignmentId.toString()),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{goal ? 'Edit Goal' : 'Add New Goal'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Goal Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g., Complete Math Project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Date</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={progress}
                onChange={(e) => setProgress(e.target.value === '' ? '' : parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Link to Assignment (Optional)</label>
            <select
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
            >
              <option value="">No Assignment</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Goal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['grade', 'assignment', 'hours', 'general'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                    type === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-md font-bold hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200"
            >
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
