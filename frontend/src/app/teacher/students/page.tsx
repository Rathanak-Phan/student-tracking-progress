"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  EyeIcon,
  XMarkIcon,
  AcademicCapIcon,
  BookOpenIcon,
  FlagIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import DialogModal from '@/components/ui/DialogModal';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AcademicRecord {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  grades: Array<{
    id: number;
    score: number;
    feedback: string;
    assignment_title: string;
    class_name: string;
    graded_at: string;
  }>;
  goals: Array<{
    id: number;
    title: string;
    target_date: string;
    is_completed: boolean;
  }>;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Student Portfolio Modal States
  const [selectedStudent, setSelectedStudent] = useState<AcademicRecord | null>(null);
  const [viewingPortfolio, setViewingPortfolio] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  const navItems = useNavItems();

  // Dialog modal state
  const [dialog, setDialog] = useState<{ open: boolean; message: string }>({
    open: false, message: ''
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/students/my-students');
      setStudents(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch student directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Open Portfolio Modal and fetch student profile details
  const handleOpenPortfolio = async (studentId: number) => {
    try {
      setPortfolioLoading(true);
      setViewingPortfolio(true);
      const response = await api.get(`/students/${studentId}/profile`);
      setSelectedStudent(response.data);
    } catch (err: any) {
      console.error(err);
      setDialog({ open: true, message: err.response?.data?.message || 'Failed to fetch student portfolio details' });
      setViewingPortfolio(false);
    } finally {
      setPortfolioLoading(false);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      student.username.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      fullName.includes(query)
    );
  });

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout navItems={navItems} title="Student Directory">
      <div className="space-y-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Student Directory</h1>
            <p className="text-gray-500 font-medium mt-1">Monitor classroom performance, view student portfolios, and track academic milestones.</p>
          </div>
          <button 
            onClick={fetchStudents}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all font-semibold text-sm shadow-sm"
          >
            <ArrowPathIcon className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Directory
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent text-gray-800 rounded-md outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-gray-400 text-sm"
            />
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-md">
            {filteredStudents.length} Students Listed
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4">Account ID</th>
                  <th className="px-6 py-4">Contact Email</th>
                  <th className="px-6 py-4 text-right">Academic Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
                            <div className="h-3 w-40 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-100 rounded-md"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded-md"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-gray-100 rounded-md ml-auto"></div></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <p className="text-red-500 font-bold mb-4">{error}</p>
                      <button onClick={fetchStudents} className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-bold text-sm">Try Again</button>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 mx-auto">
                        <UsersIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700">No Students Found</h3>
                      <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your filters or search keywords.</p>
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50/5 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 rounded-md flex items-center justify-center font-bold text-sm">
                            {student.first_name ? student.first_name.charAt(0).toUpperCase() : student.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {student.first_name && student.last_name 
                                ? `${student.first_name} ${student.last_name}`
                                : student.username}
                            </p>
                            <p className="text-xs text-gray-400 font-semibold">@{student.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-400">
                        #{student.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenPortfolio(student.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-all font-bold text-xs uppercase tracking-wider"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Portfolio
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/20 text-sm font-semibold text-gray-500">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PORTFOLIO BENTO MODAL */}
      <AnimatePresence>
        {viewingPortfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setViewingPortfolio(false); setSelectedStudent(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-md p-8 border border-gray-100 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-wider">Student Academic Record</span>
                  <h3 className="text-2xl font-black text-gray-800 mt-2">
                    {selectedStudent?.first_name && selectedStudent?.last_name
                      ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
                      : selectedStudent?.username || 'Loading Record...'}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    <EnvelopeIcon className="h-4 w-4" />
                    {selectedStudent?.email}
                  </p>
                </div>
                <button 
                  onClick={() => { setViewingPortfolio(false); setSelectedStudent(null); }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {portfolioLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading academic record portfolio...</p>
                </div>
              ) : selectedStudent && (
                <div className="space-y-8">
                  {/* Bento Row 1: Key Metrics & Goals */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Overall Score / Progress Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-md text-white shadow-xl flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <AcademicCapIcon className="h-10 w-10 opacity-80" />
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">Overall Average</span>
                      </div>
                      <div className="my-6">
                        <p className="text-4xl font-black tracking-tight">
                          {selectedStudent.grades.length > 0 
                            ? `${Math.round(selectedStudent.grades.reduce((acc, curr) => acc + Number(curr.score), 0) / selectedStudent.grades.length)}%` 
                            : 'N/A'}
                        </p>
                        <p className="text-xs opacity-75 mt-1 font-semibold">Based on {selectedStudent.grades.length} graded assignments</p>
                      </div>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-1000" 
                          style={{ 
                            width: `${selectedStudent.grades.length > 0 
                              ? selectedStudent.grades.reduce((acc, curr) => acc + Number(curr.score), 0) / selectedStudent.grades.length 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones & Goals */}
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-100/60 md:col-span-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <FlagIcon className="h-5 w-5 text-indigo-600" />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Target Milestones & Personal Goals</h4>
                      </div>
                      {selectedStudent.goals.length === 0 ? (
                        <p className="text-gray-400 text-sm font-medium py-6 text-center">No goal tracking items set by this student.</p>
                      ) : (
                        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                          {selectedStudent.goals.map((goal, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-md">
                              <div className={`p-1 rounded-md ${goal.is_completed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                <CheckCircleIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className={`font-bold text-sm ${goal.is_completed ? 'text-gray-400 line-through font-medium' : 'text-gray-700'}`}>{goal.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                              </div>
                              <span className={`ml-auto px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${goal.is_completed ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                {goal.is_completed ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bento Row 2: Assignment Grades list */}
                  <div className="bg-gray-50 p-6 rounded-md border border-gray-100/60">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <BookOpenIcon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-bold text-sm uppercase tracking-wide font-sans">Graded Submissions History</h4>
                    </div>
                    {selectedStudent.grades.length === 0 ? (
                      <p className="text-gray-400 text-sm font-medium py-8 text-center">No graded submissions registered for this student.</p>
                    ) : (
                      <div className="overflow-hidden border border-gray-100 rounded-md bg-white divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                        {selectedStudent.grades.map((grade) => (
                          <div key={grade.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-bold text-gray-800 text-sm">{grade.assignment_title}</p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{grade.class_name}</p>
                              {grade.feedback && (
                                <p className="text-xs text-gray-500 italic bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 mt-2 max-w-xl">
                                  &ldquo;{grade.feedback}&rdquo;
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-block px-3 py-1.5 rounded-md text-lg font-black tracking-tight 
                                ${grade.score >= 85 ? 'bg-green-50 text-green-600' :
                                  grade.score >= 70 ? 'bg-blue-50 text-blue-600' :
                                  'bg-orange-50 text-orange-600'}`}>
                                {grade.score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dialog Modal for errors */}
      <DialogModal
        isOpen={dialog.open}
        onClose={() => setDialog(d => ({ ...d, open: false }))}
        type="error"
        title="Error"
        message={dialog.message}
        confirmText="OK"
      />
    </DashboardLayout>
  );
}
