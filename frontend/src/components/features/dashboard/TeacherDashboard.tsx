"use client";

import { useState, useEffect } from 'react';
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
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Card from '@/components/ui/Card';
import PerformanceCircle from '@/components/dashboard/PerformanceCircle';
import ActivityLog from '@/components/dashboard/ActivityLog';
import Badge from '@/components/ui/Badge';
import { LoadingState, ErrorState } from '@/components/ui/FeedbackStates';
import { useDashboard } from '@/hooks/useDashboard';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';

import CreateClassModal from '@/components/features/classes/CreateClassModal';
import CreateAssignmentModal from '@/components/features/assignments/CreateAssignmentModal';

const TeacherDashboard = () => {
  const { data, loading, error, refresh } = useDashboard('teacher');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [allPendingRequests, setAllPendingRequests] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const navItems = useNavItems();

  // Fetch pending requests for all classes
  useEffect(() => {
    const fetchAllPendingRequests = async () => {
      if (!data?.classes || data.classes.length === 0) return;
      
      try {
        setPendingLoading(true);
        const allRequests: any[] = [];
        
        for (const classItem of data.classes) {
          try {
            const response = await api.get(`/classes/${classItem.id}/join-requests`);
            const requestsWithClassInfo = response.data.map((req: any) => ({
              ...req,
              class_id: classItem.id,
              class_name: classItem.name
            }));
            allRequests.push(...requestsWithClassInfo);
          } catch (err) {
            console.error(`Failed to fetch pending requests for class ${classItem.id}`, err);
          }
        }
        
        setAllPendingRequests(allRequests);
      } finally {
        setPendingLoading(false);
      }
    };

    if (!loading) {
      fetchAllPendingRequests();
    }
  }, [data?.classes, loading]);

  if (loading && !data) return (
    <DashboardLayout navItems={navItems} title="Instructor Portal">
      <LoadingState message="Loading analytics..." />
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout navItems={navItems} title="Instructor Portal">
      <ErrorState error={error} onRetry={refresh} />
    </DashboardLayout>
  );

  const stats = [
    { label: "Total Students", value: data?.stats?.totalStudents || 0, icon: UsersIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Active Classes", value: data?.stats?.totalClasses || 0, icon: AcademicCapIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Assignments", value: data?.stats?.totalAssignments || 0, icon: DocumentTextIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Avg. Score", value: data?.stats?.averageGrade !== "0.00" ? `${data.stats.averageGrade}%` : "N/A", icon: ArrowTrendingUpIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
    { label: "Sub. Rate", value: `${data?.stats?.submissionRate || 0}%`, icon: ArrowTrendingUpIcon, color: "bg-gray-100", textColor: "text-gray-700", bgColor: "bg-white" },
  ];

  const filteredStudents = selectedClassId === 'all' 
    ? data?.studentPerformance 
    : data?.studentPerformance?.filter((s: any) => s.class_id.toString() === selectedClassId);

  return (
    <DashboardLayout navItems={navItems} title="Instructor Portal">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, Instructor
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's an overview of your classes and student performance today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Pending Join Requests Section */}
      {allPendingRequests.length > 0 && (
        <div className="mb-8">
          <Card title={`Pending Join Requests (${allPendingRequests.length})`}>
            <div className="space-y-3">
              {allPendingRequests.slice(0, 5).map((request) => (
                <Link key={`${request.class_id}-${request.id}`} href={`/classes/${request.class_id}`}>
                  <div className="p-4 rounded-lg border border-amber-100 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-200 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold uppercase flex-shrink-0">
                          {request.username?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{(request.first_name || '') + ' ' + (request.last_name || '') || request.username}</p>
                          <p className="text-xs text-gray-500">{request.class_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(request.requested_at).toLocaleDateString()}</span>
                        <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {allPendingRequests.length > 5 && (
                <Link href="/teacher/classes">
                  <p className="text-sm font-semibold text-blue-600 hover:text-blue-700 text-center py-2">
                    View all {allPendingRequests.length} pending requests
                  </p>
                </Link>
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card title="Student Performance" headerAction={
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-gray-50/80 border border-gray-200/80 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer hover:bg-gray-100/80"
              >
                <option value="all">All Students</option>
                {data?.classes?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
          }>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Student</th>
                    <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-center">Avg. Grade</th>
                    <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents?.map((student: any, index: number) => (
                    <tr key={`${student.id}-${student.class_id || index}`} className="group hover:bg-gray-50/80 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/50 flex items-center justify-center text-gray-700 font-bold text-sm shadow-sm">
                            {student.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{student.username}</p>
                            <p className="text-[11px] font-medium text-gray-500 mt-0.5">{student.class_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-gray-900">{student.average_grade}%</span>
                      </td>
                      <td className="py-4 text-right">
                        <Badge variant={parseFloat(student.average_grade) >= 50 ? 'success' : 'error'}>
                          {parseFloat(student.average_grade) >= 50 ? 'Passing' : 'At Risk'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card title="Quick Actions">
             <div className="grid grid-cols-1 gap-3">
               <button onClick={() => setShowCreateClass(true)} className="flex items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md text-gray-700 transition-all group">
                 <span className="font-semibold text-sm tracking-tight">Create Class</span>
                 <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                   <PlusIcon className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                 </div>
               </button>
               <button onClick={() => setShowCreateAssignment(true)} className="flex items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md text-gray-700 transition-all group">
                 <span className="font-semibold text-sm tracking-tight">Create Assignment</span>
                 <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                   <PlusIcon className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                 </div>
               </button>
             </div>
          </Card>

          <Card variant="dark" title="Submission Rate">
            <PerformanceCircle 
              percentage={parseFloat(data?.stats?.submissionRate) || 0} 
              sublabel={`Student engagement across ${data?.stats?.totalClasses} active classes`}
            />
          </Card>
        </div>
      </div>

      <CreateClassModal isOpen={showCreateClass} onClose={() => setShowCreateClass(false)} onSuccess={refresh} />
      <CreateAssignmentModal isOpen={showCreateAssignment} onClose={() => setShowCreateAssignment(false)} onSuccess={refresh} />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
