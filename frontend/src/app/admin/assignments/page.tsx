"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import { motion } from 'framer-motion';
import { assignmentService } from '@/services/assignmentService';
import Link from 'next/link';

interface AssignmentData {
  id: number;
  title: string;
  class_name: string;
  teacher_name: string;
  due_date: string;
  total_students: number;
  submitted_count: number;
  late_count: number;
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLate, setFilterLate] = useState(false);
  const navItems = useNavItems();

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAdminAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      alert('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.class_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLate = filterLate ? a.late_count > 0 : true;
    return matchesSearch && matchesLate;
  });

  return (
    <DashboardLayout navItems={navItems} title="Assignment Oversight">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Assignment Oversight</h1>
            <p className="text-gray-500 font-medium mt-1">Monitor global assignment submissions and detect late or missing work.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchAssignments}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all font-semibold text-sm shadow-sm"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search assignments or classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent text-gray-800 rounded-md outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 p-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={filterLate}
                onChange={(e) => setFilterLate(e.target.checked)}
                className="h-5 w-5 bg-white border-gray-300 rounded text-red-600 focus:ring-red-500/50"
              />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Show Late Submissions Only</span>
            </label>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-100 rounded-md gap-4 animate-pulse">
                  <div className="h-6 w-1/3 bg-gray-100 rounded-md"></div>
                  <div className="h-6 w-1/4 bg-gray-100 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 mx-auto">
                <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No Assignments Found</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const submissionRate = Math.round((assignment.submitted_count / assignment.total_students) * 100) || 0;
                
                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border border-gray-100 rounded-md hover:border-blue-100 hover:bg-blue-50/5 transition-all gap-6 shadow-sm"
                  >
                    {/* Left: Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-100">
                          {assignment.class_name}
                        </span>
                        {assignment.late_count > 0 && (
                          <span className="px-2.5 py-1 rounded bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-100 flex items-center gap-1">
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            {assignment.late_count} Late
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">{assignment.title}</h4>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1">
                          <UserCircleIcon className="h-4 w-4" /> Instructor: {assignment.teacher_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" /> Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Right: Stats & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:w-96">
                      
                      {/* Submission Progress */}
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-1.5">
                          <span className="text-gray-500">Submission Rate</span>
                          <span className={submissionRate >= 80 ? 'text-green-600' : 'text-orange-500'}>
                            {submissionRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex">
                          <div 
                            className={`h-full rounded-full ${submissionRate >= 80 ? 'bg-green-500' : 'bg-orange-500'}`} 
                            style={{ width: `${submissionRate}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-1.5 text-right">
                          {assignment.submitted_count} of {assignment.total_students} submitted
                        </p>
                      </div>

                      {/* Action */}
                      <Link href={`/assignments/${assignment.id}`}>
                        <button className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-bold text-xs uppercase tracking-wider transition-all shadow-md w-full sm:w-auto">
                          <DocumentCheckIcon className="h-4 w-4" />
                          Submissions
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
