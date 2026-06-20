"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  BookOpenIcon,
  UsersIcon,
  UserCircleIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  ListBulletIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DialogModal from '@/components/ui/DialogModal';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ClassData {
  id: number;
  name: string;
  description: string;
  teacher_id: number;
  teacher_name: string;
  is_archived: boolean;
  student_count: number;
  created_at: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // active, archived, all
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    classId: number | null;
    isArchived: boolean;
  }>({ isOpen: false, classId: null, isArchived: false });
  const navItems = useNavItems();

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/classes');
      
      // Ensure the correct property is mapped if backend doesn't provide it
      const formattedClasses = response.data.map((c: any) => ({
        ...c,
        is_archived: c.is_active !== undefined ? !c.is_active : false,
        student_count: c.student_count || 0
      }));
      setClasses(formattedClasses);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleArchiveClass = (classId: number, isArchived: boolean) => {
    setConfirmDialog({ isOpen: true, classId, isArchived });
  };

  const executeArchiveClass = async () => {
    if (!confirmDialog.classId) return;
    const { classId, isArchived } = confirmDialog;
    
    try {
      await api.patch(`/admin/classes/${classId}/status`, { is_active: isArchived });
      setSuccessMessage(`Class successfully ${isArchived ? 'unarchived' : 'archived'}!`);
      setClasses(prev => prev.map(c => c.id === classId ? { ...c, is_archived: !isArchived } : c));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update class status');
    } finally {
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setError(null), 3000);
      setConfirmDialog({ isOpen: false, classId: null, isArchived: false });
    }
  };

  const filteredClasses = classes.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.teacher_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'archived' ? c.is_archived : !c.is_archived;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout navItems={navItems} title="Global Class Management">
      <div className="space-y-8">
        <DialogModal
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, classId: null, isArchived: false })}
          onConfirm={executeArchiveClass}
          title={confirmDialog.isArchived ? "Unarchive Class" : "Archive Class"}
          message={`Are you sure you want to ${confirmDialog.isArchived ? 'unarchive' : 'archive'} this class?`}
          type="confirm"
          confirmText={confirmDialog.isArchived ? "Yes, Unarchive" : "Yes, Archive"}
          cancelText="Cancel"
        />
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Global Class Management</h1>
            <p className="text-gray-500 font-medium mt-1">Oversee all active and archived classes, assign instructors, and manage enrollments.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchClasses}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all font-semibold text-sm shadow-sm"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-md flex items-center gap-3 shadow-sm mb-4"
            >
              <div className="p-1 rounded-full bg-green-500 text-white">
                <CheckIcon className="h-4 w-4" />
              </div>
              {successMessage}
            </motion.div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-md flex items-center gap-3 shadow-sm mb-4"
            >
              <div className="p-1 rounded-full bg-red-500 text-white">
                <XMarkIcon className="h-4 w-4" />
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search classes or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent text-gray-800 rounded-md outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-transparent rounded-md px-3 py-1 w-full sm:w-auto">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent py-2 pr-8 text-xs font-bold text-gray-600 outline-none uppercase tracking-wider cursor-pointer"
              >
                <option value="active">Active Classes</option>
                <option value="archived">Archived Classes</option>
                <option value="all">All Classes</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {viewMode === 'list' && <CheckIcon className="h-4 w-4" />}
                <ListBulletIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {viewMode === 'grid' && <CheckIcon className="h-4 w-4" />}
                <Squares2X2Icon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Classes Grid/List View */}
        {loading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-md p-6 shadow-sm animate-pulse">
                  <div className="h-4 w-3/4 bg-gray-100 rounded-md mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-100 rounded-md mb-6"></div>
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-50">
                    <div className="h-8 w-24 bg-gray-100 rounded-md"></div>
                    <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-md p-6 shadow-sm animate-pulse space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-gray-50 rounded-md"></div>
              ))}
            </div>
          )
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-md p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 mx-auto shadow-inner">
              <BookOpenIcon className="h-10 w-10 text-blue-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Classes Found</h3>
            <p className="text-gray-500 max-w-sm font-medium mt-2 mx-auto">Try adjusting your search criteria or create a new class.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white border border-gray-100 rounded-md p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
                {cls.is_archived && (
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-md">
                    Archived
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4 mt-2">
                  <div className={`p-3 rounded-md flex-shrink-0 ${cls.is_archived ? 'bg-gray-50 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                    <BookOpenIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{cls.name}</h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-1">{cls.description}</p>
                  </div>
                </div>

                <div className="mt-auto space-y-4 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <UserCircleIcon className="h-4.5 w-4.5 text-gray-400" />
                      <span>{cls.teacher_name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <UsersIcon className="h-4.5 w-4.5 text-gray-400" />
                      <span>{cls.student_count} Students Enrolled</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Link href={`/classes/${cls.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 font-bold text-xs uppercase tracking-wider transition-colors">
                        Manage Roster
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleArchiveClass(cls.id, cls.is_archived)}
                      className={`p-2 rounded-md transition-colors ${cls.is_archived ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                      title={cls.is_archived ? "Unarchive Class" : "Archive Class"}
                    >
                      <ArchiveBoxIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                    <th className="px-6 py-4">Class Details</th>
                    <th className="px-6 py-4">Instructor</th>
                    <th className="px-6 py-4 text-center">Students</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md flex-shrink-0 ${cls.is_archived ? 'bg-gray-50 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                            <BookOpenIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{cls.name}</p>
                            <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-[250px] mt-0.5">{cls.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <UserCircleIcon className="h-4.5 w-4.5 text-gray-400" />
                          {cls.teacher_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                          {cls.student_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cls.is_archived ? (
                          <span className="inline-flex items-center justify-center bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                            Archived
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/classes/${cls.id}`}>
                            <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
                              Manage
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleArchiveClass(cls.id, cls.is_archived)}
                            className={`p-1.5 rounded-md transition-colors shadow-sm ${cls.is_archived ? 'bg-green-50 border border-green-100 text-green-600 hover:bg-green-100' : 'bg-orange-50 border border-orange-100 text-orange-600 hover:bg-orange-100'}`}
                            title={cls.is_archived ? "Unarchive Class" : "Archive Class"}
                          >
                            <ArchiveBoxIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
