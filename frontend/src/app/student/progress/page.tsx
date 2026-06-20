"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  AcademicCapIcon, 
  FlagIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BookOpenIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import DialogModal from '@/components/ui/DialogModal';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

interface Grade {
  id: number;
  score: number;
  feedback: string;
  assignment_title: string;
  class_name: string;
  graded_at: string;
}

interface Goal {
  id: number;
  title: string;
  target_date: string;
  is_completed: boolean;
}

export default function StudentProgressPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Goal Input States
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  const navItems = useNavItems();

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; message: string }>({
    open: false, message: ''
  });

  // Fetch full academic record (grades and goals)
  const fetchAcademicRecord = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch academic record (holds both grades and goals)
      const recordResponse = await api.get('/users/academic-record');
      setGrades(recordResponse.data.grades || []);
      setGoals(recordResponse.data.goals || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch academic achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicRecord();
  }, [fetchAcademicRecord]);

  // Create Goal
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalDate || addingGoal) return;

    try {
      setAddingGoal(true);
      const payload = {
        title: newGoalTitle.trim(),
        target_date: newGoalDate
      };
      const response = await api.post('/goals', payload);
      
      // Append goal or refresh
      setGoals(prev => [...prev, response.data]);
      setNewGoalTitle('');
      setNewGoalDate('');
      setIsAddGoalOpen(false);
    } catch (err: any) {
      console.error(err);
      setDialog({ open: true, message: err.response?.data?.message || 'Failed to create academic goal' });
    } finally {
      setAddingGoal(false);
    }
  };

  // Toggle Goal Complete
  const handleToggleGoal = async (goalId: number, currentlyCompleted: boolean) => {
    try {
      // Toggle or complete endpoint
      if (!currentlyCompleted) {
        await api.patch(`/goals/${goalId}/complete`);
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, is_completed: true } : g));
      } else {
        // Toggle back to incomplete: put updates status
        await api.put(`/goals/${goalId}`, { status: 'in_progress' });
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, is_completed: false } : g));
      }
    } catch (err: any) {
      console.error(err);
      setDialog({ open: true, message: err.response?.data?.message || 'Failed to update goal milestone' });
    }
  };

  // Delete Goal
  const handleDeleteGoal = async (goalId: number) => {
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (err: any) {
      console.error(err);
      setDialog({ open: true, message: err.response?.data?.message || 'Failed to delete goal' });
    }
  };

  // Calculate Metrics
  const totalScore = grades.reduce((acc, g) => acc + Number(g.score), 0);
  const overallAverage = grades.length > 0 ? Math.round(totalScore / grades.length) : null;
  
  const completedGoals = goals.filter(g => g.is_completed).length;
  const uniqueClasses = Array.from(new Set(grades.map(g => g.class_name)));

  // Determine GPA letter
  const getGPALetter = (avg: number | null) => {
    if (avg === null) return 'N/A';
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  };

  return (
    <>
    <DashboardLayout navItems={navItems} title="Academic Portfolio">
      <div className="space-y-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Academic Performance</h1>
            <p className="text-gray-500 font-medium mt-1">Review graded submissions, monitor your GPA average, and plan your academic milestones.</p>
          </div>
          <button 
            onClick={fetchAcademicRecord}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all font-semibold text-sm shadow-sm"
          >
            <ArrowPathIcon className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Records
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* GPA Card */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-md">
                <AcademicCapIcon className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">Overall GPA</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Letter Grade</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-800">{getGPALetter(overallAverage)}</span>
                {overallAverage && <span className="text-gray-500 font-semibold text-sm">({overallAverage}%)</span>}
              </div>
            </div>
          </div>

          {/* Graded Assignments Count */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-50 text-green-600 rounded-md">
                <ClipboardDocumentCheckIcon className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase">Graded Work</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Submissions</p>
              <p className="text-3xl font-black text-gray-800">{grades.length} Items</p>
            </div>
          </div>

          {/* Goals Completion Metrics */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-md">
                <FlagIcon className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black uppercase">Milestones</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Completed Goals</p>
              <p className="text-3xl font-black text-gray-800">
                {completedGoals} / {goals.length}
              </p>
            </div>
          </div>

          {/* Enrolled Active Subject list */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-md">
                <BookOpenIcon className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase">Active Subjects</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Unique Courses</p>
              <p className="text-3xl font-black text-gray-800">{uniqueClasses.length} Courses</p>
            </div>
          </div>
        </div>

        {/* Bento Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Grade Transcript History (Bento 8-Span) */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Academic Grade Transcript</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Live list of graded assignment submissions and feedback.</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 py-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-50 rounded-md border border-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : grades.length === 0 ? (
              <div className="text-center py-16 bg-gray-50/50 rounded-md border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <ClipboardDocumentCheckIcon className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-gray-700">No Graded Submissions Yet</h4>
                <p className="text-gray-400 text-sm font-medium mt-1">Once instructors grade your submissions, they will appear dynamically here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {grades.map((grade) => (
                  <div key={grade.id} className="p-5 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/5 rounded-md transition-all duration-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-wider">{grade.class_name}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {new Date(grade.graded_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-base">{grade.assignment_title}</h4>
                      {grade.feedback && (
                        <p className="text-xs text-gray-500 italic bg-gray-50 px-3.5 py-2 border border-gray-100 rounded-md max-w-xl">
                          &ldquo;{grade.feedback}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1.5 rounded-md text-lg font-black tracking-tight 
                          ${grade.score >= 85 ? 'bg-green-50 text-green-600 border border-green-100' :
                            grade.score >= 70 ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                          {grade.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Live Goals & Milestones Manager (Bento 4-Span) */}
          <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-md border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Academic Milestones</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Track your personal studying goals.</p>
                </div>
                <button
                  onClick={() => setIsAddGoalOpen(!isAddGoalOpen)}
                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-all"
                  title="Create academic goal"
                >
                  {isAddGoalOpen ? <XMarkIcon className="h-4.5 w-4.5" /> : <PlusIcon className="h-4.5 w-4.5" />}
                </button>
              </div>

              {/* Add Goal Panel */}
              <AnimatePresence>
                {isAddGoalOpen && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateGoal}
                    className="p-4 bg-gray-50 border border-gray-100 rounded-md space-y-3 overflow-hidden"
                  >
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Goal / Milestone</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Finish chemistry syllabus"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-800 rounded-md outline-none focus:border-blue-500/30 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Date</label>
                      <input 
                        type="date" 
                        required
                        value={newGoalDate}
                        onChange={(e) => setNewGoalDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-800 rounded-md outline-none focus:border-blue-500/30 text-xs font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addingGoal}
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-md shadow-blue-500/10"
                    >
                      {addingGoal ? 'Persisting...' : 'Confirm Goal'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Goals Feed */}
              {loading ? (
                <div className="space-y-3 py-4">
                  <div className="h-16 bg-gray-50 animate-pulse rounded-md"></div>
                </div>
              ) : goals.length === 0 ? (
                <div className="text-center py-10 bg-gray-50/20 border border-dashed rounded-md">
                  <FlagIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-semibold">Set an academic goal to stay motivated!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      className={`flex items-start gap-3 p-3 rounded-md border transition-all duration-300 group
                        ${goal.is_completed 
                          ? 'bg-green-50/30 border-green-100 hover:bg-green-50/50' 
                          : 'bg-white border-gray-100 hover:border-blue-100'}`}
                    >
                      <button
                        onClick={() => handleToggleGoal(goal.id, goal.is_completed)}
                        className={`p-1 rounded-md mt-0.5 transition-all 
                          ${goal.is_completed 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        title={goal.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold leading-normal truncate 
                          ${goal.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {goal.title}
                        </p>
                        <span className="block text-[8px] font-black uppercase tracking-wider text-gray-400 mt-0.5">
                          Target: {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Delete Action button visible on hover */}
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        title="Delete Milestone"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Encouragement Footer */}
            {goals.length > 0 && (
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-md mt-4">
                <div className="flex items-start gap-3">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-indigo-900 uppercase tracking-wide">Keep It Up!</h5>
                    <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                      You have unlocked and completed {Math.round((completedGoals / goals.length) * 100)}% of your academic goals for this semester!
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>

    {/* Dialog Modal for errors */}
    <DialogModal
      isOpen={dialog.open}
      onClose={() => setDialog(d => ({ ...d, open: false }))}
      type="error"
      title="Error"
      message={dialog.message}
      confirmText="OK"
    />
    </>
  );
}
