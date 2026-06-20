"use client";

import { useEffect, useCallback, useState } from 'react';
import api from '@/lib/axios';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../shared/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import ActivityLog from '../shared/ActivityLog';
import Link from 'next/link';
import GoalModal from './GoalModal';
import DialogModal from '@/components/ui/DialogModal';
import * as goalService from '../../../services/goalService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';

const Dashboard = () => {
  const navItems = useNavItems();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; type: 'error' | 'confirm'; message: string; onConfirm?: () => void }>({
    open: false, type: 'error', message: ''
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/student');
      setData(response.data);
      setGoals(response.data.goals || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSaveGoal = async (goalData: any) => {
    try {
      if (editingGoal) {
        await goalService.updateGoal(editingGoal.id, goalData);
      } else {
        await goalService.createGoal(goalData);
      }
      setShowGoalModal(false);
      setEditingGoal(null);
      fetchDashboardData();
    } catch (err: any) {
      setDialog({ open: true, type: 'error', message: err.response?.data?.message || 'Failed to save goal' });
    }
  };

  const handleRemoveGoal = (id: number) => {
    setDialog({
      open: true,
      type: 'confirm',
      message: 'Are you sure you want to delete this goal?',
      onConfirm: async () => {
        try {
          await goalService.deleteGoal(id);
          fetchDashboardData();
        } catch (err: any) {
          setDialog({ open: true, type: 'error', message: 'Failed to delete goal' });
        }
      }
    });
  };

  const handleToggleGoal = async (id: number) => {
    try {
      await goalService.markGoalComplete(id);
      fetchDashboardData();
    } catch (err: any) {
      setDialog({ open: true, type: 'error', message: 'Failed to update goal' });
    }
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    return "bg-yellow-500";
  };

  const getGoalProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    return "bg-yellow-500";
  };

  const getGoalIcon = (type: string): string => {
    switch (type) {
      case "grade": return "🎯";
      case "assignment": return "📝";
      case "hours": return "⏱️";
      default: return "🎯";
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Student Portal">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-bold animate-pulse">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems} title="Student Portal">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-red-50 rounded-md border border-red-100">
          <XMarkIcon className="h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-600 transition-all"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { 
      label: "Active Classes", 
      value: data?.summary?.totalClasses || 0, 
      icon: AcademicCapIcon, 
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Assignments", 
      value: data?.summary?.totalAssignments || 0, 
      icon: DocumentTextIcon, 
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Avg. Grade", 
      value: data?.summary?.averageGrade !== "N/A" ? `${data.summary.averageGrade}%` : "N/A", 
      icon: ChartBarIcon, 
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Submission Rate", 
      value: `${data?.summary?.progressPercentage || 0}%`, 
      icon: CheckBadgeIcon, 
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
  ];

  const chartData = data?.performance?.gradeTrend?.map((item: any) => ({
    name: new Date(item.graded_at).toLocaleDateString(),
    grade: parseFloat(item.score),
    assignment: item.assignment_title
  })) || [];

  const barChartData = data?.classes?.map((item: any) => ({
    name: item.name,
    progress: item.progress,
    count: item.total_assignments
  })) || [];

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} rounded-md shadow-sm p-6 border border-white/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-md ${stat.bgColor} shadow-inner`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className={`h-2.5 w-2.5 rounded-full ${stat.color} animate-pulse`}></div>
            </div>
            <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
            {stat.label === "Completed" && (
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span>Overall Progress</span>
                  <span className={stat.textColor}>{data?.summary?.progressPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${stat.color} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${data?.summary?.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Courses & Activity */}
        <div className="lg:col-span-8 space-y-8">
          {/* Course Progress */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Enrolled Courses</h3>
              <Link href="/classes" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.classes && data.classes.length > 0 ? (
                data.classes.map((course: any) => {
                  const progress = course.progress || 0; // Assuming progress is handled or just showing course info
                  return (
                    <div key={course.id} className="p-4 rounded-md border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-800">{course.name}</h4>
                          <p className="text-xs text-gray-500 font-medium">{course.teacher_name}</p>
                        </div>
                        <span className="text-lg font-black text-gray-800">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full ${getProgressColor(progress)} transition-all duration-700`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                  <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No courses enrolled yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Grade Trend Line Chart */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Grade Trend</h3>
              <div className="h-[250px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 10}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 10}}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        itemStyle={{fontWeight: 'bold'}}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="grade" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}}
                        activeDot={{r: 6, strokeWidth: 0}}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm font-medium">No grade data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Class Progress Bar Chart */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Progress by Class</h3>
              <div className="h-[250px] w-full">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 10}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 10}}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        cursor={{fill: '#f9fafb'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                        {barChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm font-medium">No class data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <ActivityLog 
            activities={data?.recentActivities} 
            loading={loading} 
            onRefresh={fetchDashboardData}
          />
        </div>

        {/* Right Column - Summary & Goals */}
        <div className="lg:col-span-4 space-y-8">
          {/* Performance Circle */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-md shadow-xl p-8 text-white">
            <h3 className="text-lg font-bold mb-6">Overall Performance</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                  <circle 
                    cx="50" cy="50" r="40" fill="none" stroke="#60a5fa" strokeWidth="8" 
                    strokeLinecap="round" strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (parseFloat(data?.summary?.averageGrade) || 0)) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black italic">{data?.summary?.averageGrade !== "N/A" ? `${data.summary.averageGrade}%` : "0%"}</span>
                  <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Grade</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-400">{data?.summary?.submittedAssignments || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks Done</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-indigo-400">{(data?.summary?.totalAssignments || 0) - (data?.summary?.submittedAssignments || 0)}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Study Goals */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Personal Goals</h3>
              <button 
                onClick={() => { setEditingGoal(null); setShowGoalModal(true); }}
                className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {goals.length > 0 ? (
                goals.map((goal) => {
                  const percentage = goal.progress || 0;
                  const isCompleted = goal.status === 'completed';
                  return (
                    <div key={goal.id} className="group p-4 rounded-md hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleGoal(goal.id)}
                            className={`text-xl transition-all ${isCompleted ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 hover:scale-110'}`}
                            title={isCompleted ? "Goal Completed" : "Mark as Complete"}
                          >
                            {isCompleted ? '✅' : getGoalIcon(goal.type)}
                          </button>
                          <div>
                            <h4 className={`font-bold text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                              {goal.title}
                            </h4>
                            {goal.assignment_title && (
                              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                                Linked: {goal.assignment_title}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditGoal(goal)} className="p-1.5 hover:bg-blue-100 rounded-md transition-colors">
                            <PencilSquareIcon className="h-4 w-4 text-blue-500" />
                          </button>
                          <button onClick={() => handleRemoveGoal(goal.id)} className="p-1.5 hover:bg-red-100 rounded-md transition-colors">
                            <TrashIcon className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">
                          Due: {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-black text-blue-600">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No goals set</p>
                </div>
              )}
            </div>
          </div>

          <GoalModal 
            isOpen={showGoalModal} 
            onClose={() => setShowGoalModal(false)} 
            onSave={handleSaveGoal}
            goal={editingGoal}
          />
        </div>
      </div>

      {/* Dialog Modal for alerts & confirmations */}
      <DialogModal
        isOpen={dialog.open}
        onClose={() => setDialog(d => ({ ...d, open: false }))}
        onConfirm={dialog.onConfirm}
        type={dialog.type}
        title={dialog.type === 'confirm' ? 'Confirm Action' : 'Error'}
        message={dialog.message}
        confirmText={dialog.type === 'confirm' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </DashboardLayout>
  );
};

export default Dashboard;