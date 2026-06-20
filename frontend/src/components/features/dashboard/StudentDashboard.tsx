"use client";

import { useState } from 'react';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  HomeIcon,
  BookOpenIcon,
  ClipboardIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Card from '@/components/ui/Card';
import PerformanceCircle from '@/components/dashboard/PerformanceCircle';
import ActivityLog from '@/components/dashboard/ActivityLog';
import GoalModal from '@/components/features/goals/GoalModal';
import DialogModal from '@/components/ui/DialogModal';
import { LoadingState, ErrorState, StatSkeleton, CardSkeleton, ProgressSkeleton, ListSkeleton } from '@/components/ui/FeedbackStates';
import { useDashboard } from '@/hooks/useDashboard';
import { useNavItems } from '@/hooks/useNavItems';
import * as goalService from '@/services/goalService';

const StudentDashboard = () => {
  const { data, loading, error, refresh } = useDashboard('student');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const navItems = useNavItems();

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; type: 'error'; message: string }>({
    open: false, type: 'error', message: ''
  });

  const handleSaveGoal = async (goalData: any) => {
    try {
      if (editingGoal) {
        await goalService.updateGoal(editingGoal.id, goalData);
      } else {
        await goalService.createGoal(goalData);
      }
      setShowGoalModal(false);
      setEditingGoal(null);
      refresh();
    } catch (err: any) {
      // User-friendly dialog instead of native alert
      setDialog({ open: true, type: 'error', message: 'We couldn\'t save your goal. Please try again.' });
      console.error('[Goal Save Error]:', err);
    }
  };

  // Helper for empty states
  const EmptyState = ({ title, description, actionText, onAction, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-200">
      <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-sm mb-4 border border-gray-100">
        <Icon className="h-8 w-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">{description}</p>
      {actionText && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );

  // If loading and no data, show full dashboard skeleton
  if (loading && !data) {
    return (
      <DashboardLayout navItems={navItems} title="Student Portal">
        <div className="space-y-8">
          <StatSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <CardSkeleton rows={2} />
              <CardSkeleton rows={4} />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <ProgressSkeleton />
              <CardSkeleton rows={3} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If major error and no data, show full error state
  if (error && !data) {
    return (
      <DashboardLayout navItems={navItems} title="Student Portal">
        <div className="py-20">
          <ErrorState error={error} onRetry={refresh} />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Active Classes", value: data?.summary?.totalClasses || 0, icon: AcademicCapIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Assignments", value: data?.summary?.totalAssignments || 0, icon: DocumentTextIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Avg. Grade", value: data?.summary?.totalMaxScore > 0 ? `${data.summary.totalEarnedScore}/${data.summary.totalMaxScore} (${data.summary.averageGrade}%)` : "0/0 (0%)", icon: ChartBarIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Submission Rate", value: `${data?.summary?.progressPercentage || 0}%`, icon: CheckBadgeIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
  ];

  const upcomingDeadlines = data?.assignments
    ?.filter((a: any) => !a.submission_status && new Date(a.due_date) > new Date())
    ?.sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    ?.slice(0, 3) || [];

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN (70%) */}
        <div className="lg:col-span-8 space-y-8">
          {/* My Classes */}
          <Card title="My Classes" headerAction={<Link href="/classes" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">View All</Link>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.classes?.length > 0 ? data.classes.map((course: any) => (
                <div key={course.id} className="group p-5 rounded-md border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-md flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors">
                      <BookOpenIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{course.progress}%</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{course.name}</h4>
                  <p className="text-sm text-gray-500 mb-4">{course.teacher_name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2">
                  <EmptyState 
                    title="No classes yet" 
                    description="You haven't enrolled in any classes. Join a class to start your journey."
                    actionText="Find Classes"
                    onAction={() => window.location.href = '/classes'}
                    icon={AcademicCapIcon}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Recent Assignments */}
          <Card title="Recent Assignments">
            <div className="space-y-4">
              {data?.assignments?.length > 0 ? data.assignments.slice(0, 5).map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 rounded-md border border-gray-200 hover:border-gray-300 bg-white transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center border ${
                      assignment.submission_status === 'graded' ? 'bg-green-50 text-green-700 border-green-100' :
                      assignment.submission_status === 'submitted' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      <ClipboardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5">{assignment.title}</p>
                      <p className="text-xs text-gray-500">{assignment.class_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500 mb-0.5">Due Date</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(assignment.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded text-xs font-medium border ${
                      assignment.submission_status === 'graded' ? 'bg-green-50 text-green-700 border-green-200' :
                      assignment.submission_status === 'submitted' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-600 border-gray-200'
                    }`}>
                      {assignment.submission_status === 'graded' ? (
                        <span>Score: {assignment.grade}/{assignment.max_score}</span>
                      ) : (
                        assignment.submission_status || 'Pending'
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <EmptyState 
                  title="No assignments" 
                  description="Great job! You have no pending assignments at the moment."
                  icon={DocumentTextIcon}
                />
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (30%) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.location.href = '/classes'}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-md group transition-all shadow-sm"
              >
                <PlusIcon className="w-5 h-5 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Join Class</span>
              </button>
              <button 
                onClick={() => { setEditingGoal(null); setShowGoalModal(true); }}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-md group transition-all shadow-sm"
              >
                <ChartBarIcon className="w-5 h-5 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Set Goal</span>
              </button>
            </div>
          </Card>

          {/* Progress Summary */}
          <Card variant="dark" title="Performance Progress">
            <PerformanceCircle 
              percentage={parseFloat(data?.summary?.averageGrade) || 0} 
              sublabel={`Score: ${data?.summary?.totalEarnedScore || 0}/${data?.summary?.totalMaxScore || 0} across ${data?.summary?.totalClasses || 0} active courses`}
            />
          </Card>

          {/* Upcoming Deadlines */}
          <Card title="Deadlines" headerAction={<Link href="/student/assignments" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">See More</Link>}>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((item: any) => (
                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-all shadow-sm">
                  <p className="text-xs font-medium text-gray-500 mb-1">{item.class_name}</p>
                  <p className="text-sm font-semibold text-gray-900 mb-2">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    Due in {Math.ceil((new Date(item.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              )) : (
                <p className="text-center py-6 text-gray-500 text-sm font-medium">No upcoming deadlines</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <GoalModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} onSave={handleSaveGoal} goal={editingGoal} />

      {/* Dialog Modal for errors */}
      <DialogModal
        isOpen={dialog.open}
        onClose={() => setDialog(d => ({ ...d, open: false }))}
        type={dialog.type}
        title="Error"
        message={dialog.message}
        confirmText="OK"
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
