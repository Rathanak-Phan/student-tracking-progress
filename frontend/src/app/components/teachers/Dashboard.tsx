"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PlusIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../shared/DashboardLayout';
import api from '@/lib/axios';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import CreateClassModal from '../classes/CreateClassModal';
import CreateAssignmentModal from './CreateAssignmentModal';
import ActivityLog from '../shared/ActivityLog';

import { useNavItems } from '@/hooks/useNavItems';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const navItems = useNavItems();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/teacher');
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load teacher dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !data) {
    return (
      <DashboardLayout navItems={navItems} title="Instructor Portal">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Loading Analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { 
      label: "Total Students", 
      value: data?.stats?.totalStudents || 0, 
      icon: UsersIcon, 
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Active Classes", 
      value: data?.stats?.totalClasses || 0, 
      icon: AcademicCapIcon, 
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Assignments", 
      value: data?.stats?.totalAssignments || 0, 
      icon: DocumentTextIcon, 
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Avg. Score", 
      value: data?.stats?.averageGrade !== "0.00" ? `${data.stats.averageGrade}%` : "N/A", 
      icon: ArrowTrendingUpIcon, 
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      label: "Sub. Rate", 
      value: `${data?.stats?.submissionRate || 0}%`, 
      icon: ArrowTrendingUpIcon, 
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
  ];

  const filteredStudents = selectedClassId === 'all' 
    ? data?.studentPerformance 
    : data?.studentPerformance?.filter((s: any) => s.class_id.toString() === selectedClassId);

  const classPerformanceData = data?.classes?.map((c: any) => ({
    name: c.name,
    count: c.student_count,
    // We don't have avg grade per class in the class list yet, let's assume we might want to add it or just show student count
  })) || [];

  // Let's refine classPerformanceData if we can get averages. 
  // Actually, let's just use the student counts for now, or I can add a query for class averages.

  return (
    <DashboardLayout navItems={navItems} title="Instructor Portal">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} rounded-md shadow-sm p-6 border border-white/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-md ${stat.bgColor} shadow-inner`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className={`h-2 w-2 rounded-full ${stat.color} animate-pulse`}></div>
            </div>
            <p className="text-gray-500 text-[10px] font-black mb-1 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline">
              <p className="text-3xl font-black text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Analytics Row */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter mb-6">Class Enrollment</h3>
            <div className="h-[300px] w-full">
              {classPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformanceData}>
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
                    />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                      {classPerformanceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
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

          {/* Student Performance Table */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">Student Performance</h3>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <select 
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-48"
                >
                  <option value="all">All Students</option>
                  {data?.classes?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">Student</th>
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Avg. Grade</th>
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Submission Rate</th>
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents?.length > 0 ? filteredStudents.map((student: any, idx: number) => {
                    const avgGrade = parseFloat(student.average_grade) || 0;
                    const subRate = student.total_assignments > 0 
                      ? Math.round((student.submissions_count / student.total_assignments) * 100) 
                      : 0;
                    
                    return (
                      <tr key={`${student.id}-${student.class_id || idx}`} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-100">
                              {student.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{student.username}</p>
                              {selectedClassId === 'all' && (
                                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">{student.class_name}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className={`font-black ${avgGrade >= 80 ? 'text-green-600' : avgGrade >= 50 ? 'text-blue-600' : 'text-red-500'}`}>
                            {avgGrade ? `${avgGrade.toFixed(1)}%` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-5 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-700 mb-1">{subRate}%</span>
                            <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${subRate >= 80 ? 'bg-green-500' : subRate >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                style={{ width: `${subRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${avgGrade >= 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {avgGrade >= 50 ? 'Passing' : 'At Risk'}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 font-medium italic">No student performance data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Classes Overview */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">My Classes</h3>
              <Link href="/classes">
                <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
                  <PlusIcon className="h-5 w-5" />
                  <span className="text-sm font-bold">Manage All</span>
                </button>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">Class Name</th>
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Students</th>
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Code</th>
                    <th className="pb-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.classes?.length > 0 ? data.classes.map((item: any) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5">
                        <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs font-bold">{item.student_count} Students</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{item.code}</span>
                      </td>
                      <td className="py-5 text-right">
                        <Link href={`/classes/${item.id}`}>
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <ArrowTrendingUpIcon className="h-5 w-5" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 font-medium italic">No classes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setShowCreateClass(true)}
                className="flex items-center justify-between p-5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-md group-hover:bg-blue-500/20 transition-colors">
                    <AcademicCapIcon className="h-6 w-6" />
                  </div>
                  <span className="font-black italic uppercase tracking-tighter">Create Class</span>
                </div>
                <PlusIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setShowCreateAssignment(true)}
                className="flex items-center justify-between p-5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-md group-hover:bg-purple-500/20 transition-colors">
                    <ClipboardIcon className="h-6 w-6" />
                  </div>
                  <span className="font-black italic uppercase tracking-tighter">Create Assignment</span>
                </div>
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Submission Overview Circle */}
          <div className="bg-gray-900 rounded-md shadow-xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/40 transition-colors duration-500"></div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Submission Rate</h3>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                  <circle 
                    cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10" 
                    strokeLinecap="round" strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (parseFloat(data?.stats?.submissionRate) || 0)) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black italic">{data?.stats?.submissionRate || 0}%</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Overall</span>
                </div>
              </div>
              <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                Student engagement across <span className="text-white">{data?.stats?.totalClasses} active classes</span>
              </p>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter mb-8">Recent Submissions</h3>
            <div className="space-y-8">
              {data?.recentSubmissions?.length > 0 ? data.recentSubmissions.map((sub: any) => (
                <div key={sub.id} className="flex gap-4 group">
                  <div className="h-12 w-12 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 text-orange-600">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 border-b border-gray-50 pb-6 group-last:border-0">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{sub.student_name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{sub.assignment_title}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <ClockIcon className="h-3 w-3 text-gray-300" />
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-gray-400 font-medium italic">No recent submissions.</div>
              )}
            </div>
            
            <Link href="/teacher/assignments">
              <button className="w-full mt-8 py-4 rounded-md bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 hover:text-gray-800 transition-all">
                View All Assignments
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateClassModal 
        isOpen={showCreateClass} 
        onClose={() => setShowCreateClass(false)} 
        onSuccess={fetchDashboardData} 
      />
      <CreateAssignmentModal 
        isOpen={showCreateAssignment} 
        onClose={() => setShowCreateAssignment(false)} 
        onSuccess={fetchDashboardData} 
      />
    </DashboardLayout>
  );
};

export default Dashboard;