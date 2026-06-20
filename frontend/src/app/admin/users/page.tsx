"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BookOpenIcon,
  CheckCircleIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
  UserMinusIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import DialogModal from '@/components/ui/DialogModal';

interface User {
  id: number;
  username: string;
  email: string;
  role_name: 'admin' | 'teacher' | 'student';
  is_active: boolean;
  is_validated: boolean;
  created_at: string;
}

interface TeacherPending {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AcademicRecord {
  id: number;
  username: string;
  email: string;
  role_name: string;
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
  enrollments: Array<{
    name: string;
    enrolled_at: string;
    status: string;
  }>;
}

export default function UserManagementPage() {
  // Navigation & Tabs state
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  
  // Data lists
  const [users, setUsers] = useState<User[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<TeacherPending[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Modals state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<AcademicRecord | null>(null);
  const [viewingStudentRecord, setViewingStudentRecord] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);
  const [actioningId, setActioningId] = useState<number | null>(null);

  // Form State for Editing
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRoleId, setEditRoleId] = useState(3); // 1 = admin, 2 = teacher, 3 = student
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsValidated, setEditIsValidated] = useState(true);

  // Modal confirmation state
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm' as 'confirm' | 'warning' | 'error' | 'success' | 'info',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const closeDialog = () => setDialogConfig(prev => ({ ...prev, isOpen: false }));

  const navItems = useNavItems();

  // Fetch all users with filters
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
      };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data);
      setSelectedUserIds([]);
      setHasMore(response.data.length === 10);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, roleFilter, statusFilter]);

  // Fetch pending teachers
  const fetchPendingTeachers = useCallback(async () => {
    try {
      setPendingLoading(true);
      const response = await api.get('/admin/teachers/pending');
      setPendingTeachers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending validation list');
    } finally {
      setPendingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchUsers();
    } else {
      fetchPendingTeachers();
    }
  }, [activeTab, fetchUsers, fetchPendingTeachers]);

  // Handle Approve/Reject Pending Teacher
  const handleApproveTeacher = async (id: number) => {
    try {
      setActioningId(id);
      setError(null);
      const response = await api.put(`/admin/teachers/${id}/approve`);
      setSuccessMessage(response.data.message || 'Teacher approved successfully!');
      setPendingTeachers(prev => prev.filter(t => t.id !== id));
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve teacher');
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectTeacher = (id: number) => {
    setDialogConfig({
      isOpen: true,
      title: 'Reject Registration',
      message: 'Are you sure you want to reject this request? The user will be reverted to a standard student account.',
      type: 'confirm',
      confirmText: 'Reject Request',
      onConfirm: async () => {
        try {
          setActioningId(id);
          setError(null);
          const response = await api.put(`/admin/teachers/${id}/reject`);
          setSuccessMessage(response.data.message || 'Teacher request rejected and user reverted to student.');
          setPendingTeachers(prev => prev.filter(t => t.id !== id));
          setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to reject teacher');
        } finally {
          setActioningId(null);
        }
      }
    });
  };

  // Toggle user active status
  const handleToggleStatus = (user: User) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    setDialogConfig({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User Account`,
      message: `Are you sure you want to ${action} the account for ${user.username}?`,
      type: 'confirm',
      confirmText: `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      onConfirm: async () => {
        try {
          setActioningId(user.id);
          setError(null);
          await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active });
          setSuccessMessage(`User successfully ${user.is_active ? 'deactivated' : 'activated'}!`);
          setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
          setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err: any) {
          setError(err.response?.data?.message || `Failed to update status`);
        } finally {
          setActioningId(null);
        }
      }
    });
  };

  // Delete user
  const handleDeleteUser = (id: number, name: string) => {
    setDialogConfig({
      isOpen: true,
      title: 'Delete User Account',
      message: `CRITICAL WARNING: Are you sure you want to delete ${name}? This will soft-delete their account and restrict all access.`,
      type: 'confirm',
      confirmText: 'Delete Account',
      onConfirm: async () => {
        try {
          setActioningId(id);
          setError(null);
          await api.delete(`/admin/users/${id}`);
          setSuccessMessage("User deleted successfully!");
          setUsers(prev => prev.filter(u => u.id !== id));
          setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
          setActioningId(null);
        }
      }
    });
  };

  // Bulk Actions
  const handleBulkAction = async (action: string) => {
    if (selectedUserIds.length === 0) return;
    
    setDialogConfig({
      isOpen: true,
      title: `Confirm Bulk ${action}`,
      message: `Are you sure you want to apply this action to ${selectedUserIds.length} users?`,
      type: 'confirm',
      confirmText: 'Confirm Bulk Action',
      onConfirm: async () => {
        try {
          setLoading(true);
          const data = action === 'suspend' ? { status: 'suspended' } : action === 'activate' ? { status: 'active' } : null;
          const apiAction = action === 'delete' ? 'delete' : 'update_status';
          await api.post('/admin/users/bulk-action', { userIds: selectedUserIds, action: apiAction, data });
          setSuccessMessage(`Bulk action applied successfully!`);
          fetchUsers(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to perform bulk action');
        } finally {
          setLoading(false);
        }
      }
    });
  };


  // Open Edit modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRoleId(user.role_name === 'admin' ? 1 : user.role_name === 'teacher' ? 2 : 3);
    setEditIsActive(user.is_active);
    setEditIsValidated(user.is_validated);
  };

  // Save edited user
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setActioningId(editingUser.id);
      setError(null);
      const data = {
        username: editUsername,
        email: editEmail,
        role_id: editRoleId,
        is_active: editIsActive,
        is_validated: editIsValidated
      };

      await api.put(`/admin/users/${editingUser.id}`, data);
      setSuccessMessage("User profile updated successfully!");
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { 
        ...u, 
        username: editUsername, 
        email: editEmail,
        role_name: editRoleId === 1 ? 'admin' : editRoleId === 2 ? 'teacher' : 'student',
        is_active: editIsActive,
        is_validated: editIsValidated
      } : u));
      setEditingUser(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile changes');
    } finally {
      setActioningId(null);
    }
  };

  // View student detailed academic record
  const handleViewAcademicRecord = async (studentId: number) => {
    try {
      setRecordLoading(true);
      setViewingStudentRecord(true);
      setError(null);
      const response = await api.get(`/admin/users/${studentId}/academic-record`);
      setSelectedStudent(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch student record');
      setViewingStudentRecord(false);
    } finally {
      setRecordLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="User Administration">
      <div className="space-y-8">
        
        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">User Administration</h1>
            <p className="text-gray-500 font-medium mt-1">Manage system memberships, approve roles, and view student performance portfolios.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (activeTab === 'all') fetchUsers();
                else fetchPendingTeachers();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all font-semibold text-sm shadow-sm"
            >
              <ArrowPathIcon className={`h-4 w-4 ${(loading || pendingLoading) ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Global Success / Error Notifiers */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-md flex items-center gap-3 shadow-sm"
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
              className="p-4 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-md flex items-center gap-3 shadow-sm"
            >
              <div className="p-1 rounded-full bg-red-500 text-white">
                <XMarkIcon className="h-4 w-4" />
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Tabs */}
        <div className="border-b border-gray-200 flex gap-6">
          <button 
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            All System Users
          </button>
          <button 
            onClick={() => { setActiveTab('pending'); }}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Pending Approvals
            {pendingTeachers.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">{pendingTeachers.length}</span>
            )}
          </button>
        </div>

        {/* Tab 1: All Users Dashboard */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Filter controls panel */}
            <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:max-w-md group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search user, email..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent text-gray-800 rounded-md outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Dropdowns */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-gray-50 border border-transparent rounded-md px-3 py-1 w-full sm:w-auto">
                  <FunnelIcon className="h-4 w-4 text-gray-400" />
                  <select 
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                    className="bg-transparent py-2 pr-8 text-xs font-bold text-gray-600 outline-none uppercase tracking-wider cursor-pointer"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Administrators</option>
                    <option value="teacher">Teachers</option>
                    <option value="student">Students</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 border border-transparent rounded-md px-3 py-1 w-full sm:w-auto">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="bg-transparent py-2 pr-8 text-xs font-bold text-gray-600 outline-none uppercase tracking-wider cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions (Only visible if users are selected) */}
              {selectedUserIds.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-md">
                  <span className="text-xs font-bold text-blue-700">{selectedUserIds.length} Selected</span>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkAction(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-white border border-blue-200 text-xs font-bold text-blue-700 px-3 py-1 rounded cursor-pointer outline-none"
                  >
                    <option value="">Bulk Actions...</option>
                    <option value="activate">Set Active</option>
                    <option value="suspend">Suspend Users</option>
                    <option value="delete">Delete Users</option>
                  </select>
                </div>
              )}

            </div>

            {/* Users Table */}
            <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4 w-12">
                        <input 
                          type="checkbox" 
                          checked={users.length > 0 && selectedUserIds.length === users.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedUserIds(users.map(u => u.id));
                            else setSelectedUserIds([]);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">System Role</th>
                      <th className="px-6 py-4">Validation Status</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [1, 2, 3, 4, 5].map((i) => (
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
                          <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full"></div></td>
                          <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded-md"></div></td>
                          <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded-md"></div></td>
                          <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-gray-100 rounded-md ml-auto"></div></td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16">
                          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 mx-auto">
                            <UsersIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-700">No Users Found</h3>
                          <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your filters or search terms.</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className={`hover:bg-blue-50/5 transition-all group ${selectedUserIds.includes(user.id) ? 'bg-blue-50/20' : ''}`}>
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              checked={selectedUserIds.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedUserIds(prev => [...prev, user.id]);
                                else setSelectedUserIds(prev => prev.filter(id => id !== user.id));
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 rounded-md flex items-center justify-center font-bold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 flex items-center gap-1.5">
                                  {user.username}
                                  {!user.is_active && (
                                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wider">Deactivated</span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 font-semibold">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider 
                              ${user.role_name === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                                user.role_name === 'teacher' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                              {user.role_name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-400'} animate-pulse`}></span>
                              <span className="text-xs font-bold text-gray-600">
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                            {new Date(user.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              
                              {/* Student Performance Profile */}
                              {user.role_name === 'student' && (
                                <button
                                  onClick={() => handleViewAcademicRecord(user.id)}
                                  title="View Academic Transcript"
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                                >
                                  <EyeIcon className="h-4.5 w-4.5" />
                                </button>
                              )}

                              {/* Toggle Status Icon */}
                              <button
                                onClick={() => handleToggleStatus(user)}
                                title={user.is_active ? 'Deactivate User' : 'Activate User'}
                                className={`p-2 rounded-md transition-all ${user.is_active ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}
                              >
                                {user.is_active ? <UserMinusIcon className="h-4.5 w-4.5" /> : <UserPlusIcon className="h-4.5 w-4.5" />}
                              </button>

                              {/* Edit Profile */}
                              <button
                                onClick={() => handleOpenEdit(user)}
                                title="Edit Profile Details"
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                              >
                                <PencilIcon className="h-4.5 w-4.5" />
                              </button>

                              {/* Delete Profile */}
                              <button
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                title="Delete Account"
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                              >
                                <TrashIcon className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Simple Pagination Footer */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/20 text-sm font-semibold text-gray-500">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button 
                  disabled={!hasMore}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Pending Approval Queue */}
        {activeTab === 'pending' && (
          <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                  <AcademicCapIcon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Pending Instructor Registrations</h2>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                {pendingTeachers.length} Waiting
              </span>
            </div>

            <div className="p-6">
              {pendingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-100 rounded-md gap-4 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-gray-100"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
                          <div className="h-3 w-48 bg-gray-100 rounded-md"></div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-10 w-24 bg-gray-100 rounded-md"></div>
                        <div className="h-10 w-24 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingTeachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-inner">
                    <ShieldCheckIcon className="h-10 w-10 text-blue-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">All Caught Up!</h3>
                  <p className="text-gray-500 max-w-sm font-medium mt-2">There are currently no pending teacher registrations awaiting validation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {pendingTeachers.map((teacher) => (
                      <motion.div
                        key={teacher.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/5 rounded-md gap-4 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start md:items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-md flex items-center justify-center font-bold shadow-md shadow-blue-500/10">
                            {teacher.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                              {teacher.username}
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Teacher</span>
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
                              <span className="flex items-center gap-1.5">
                                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                {teacher.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                                Registered: {new Date(teacher.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleRejectTeacher(teacher.id)}
                            disabled={actioningId !== null}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50/60 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveTeacher(teacher.id)}
                            disabled={actioningId !== null}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 active:scale-[0.98] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-blue-500/10"
                          >
                            <CheckIcon className="h-4 w-4" />
                            Approve
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Edit Profile Details */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-md p-8 border border-gray-100 shadow-2xl z-10 space-y-6 overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Edit User Profile</h3>
                <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-5">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md outline-none focus:bg-white focus:border-blue-500/30 transition-all font-semibold text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md outline-none focus:bg-white focus:border-blue-500/30 transition-all font-semibold text-sm"
                  />
                </div>

                {/* Role dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                  <select 
                    value={editRoleId}
                    onChange={(e) => setEditRoleId(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md outline-none focus:bg-white focus:border-blue-500/30 transition-all font-semibold text-sm cursor-pointer"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Teacher</option>
                    <option value={3}>Student</option>
                  </select>
                </div>

                {/* Validation & Active Toggles */}
                <div className="grid grid-cols-2 gap-4 py-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-md cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="h-5 w-5 bg-white border-gray-300 rounded text-blue-600 focus:ring-blue-500/50"
                    />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Account Active</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-md cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editIsValidated}
                      onChange={(e) => setEditIsValidated(e.target.checked)}
                      className="h-5 w-5 bg-white border-gray-300 rounded text-blue-600 focus:ring-blue-500/50"
                    />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Validated User</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-5 py-2.5 border rounded-md hover:bg-gray-50 font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={actioningId !== null}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 active:scale-[0.98] font-bold text-sm transition-all disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Student Academic Performance Record */}
      <AnimatePresence>
        {viewingStudentRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setViewingStudentRecord(false); setSelectedStudent(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-md p-8 border border-gray-100 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-wider">Student Academic Record</span>
                  <h3 className="text-2xl font-black text-gray-800 mt-2">{selectedStudent?.username || 'Loading Record...'}</h3>
                  <p className="text-gray-400 text-sm font-medium">{selectedStudent?.email}</p>
                </div>
                <button 
                  onClick={() => { setViewingStudentRecord(false); setSelectedStudent(null); }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {recordLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading academic files...</p>
                </div>
              ) : selectedStudent && (
                <div className="space-y-8">
                  {/* Bento Row 1: Enrollments & Progress Goals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Enrollments */}
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-100/60">
                      <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <BookOpenIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Class Enrollments</h4>
                      </div>
                      {selectedStudent.enrollments.length === 0 ? (
                        <p className="text-gray-400 text-sm font-medium py-4 text-center">No active class enrollments found.</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedStudent.enrollments.map((enr, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-md">
                              <div>
                                <p className="font-bold text-gray-700 text-sm">{enr.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Joined {new Date(enr.enrolled_at).toLocaleDateString()}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider">{enr.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Academic Goals */}
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-100/60">
                      <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <FlagIcon className="h-5 w-5 text-indigo-600" />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Student Milestones & Goals</h4>
                      </div>
                      {selectedStudent.goals.length === 0 ? (
                        <p className="text-gray-400 text-sm font-medium py-4 text-center">No personal goal tracking items configured.</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedStudent.goals.map((goal, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-md">
                              <div className={`p-1 rounded-md ${goal.is_completed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                <CheckCircleIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className={`font-bold text-sm ${goal.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{goal.title}</p>
                                <p className="text-[10px] text-gray-400 font-semibold">Target Date: {new Date(goal.target_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Bento Row 2: Assignment Grades list */}
                  <div className="bg-gray-50 p-6 rounded-md border border-gray-100/60">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <AcademicCapIcon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-bold text-sm uppercase tracking-wide">Submission & Grading History</h4>
                    </div>
                    {selectedStudent.grades.length === 0 ? (
                      <p className="text-gray-400 text-sm font-medium py-8 text-center">No graded submissions registered for this student.</p>
                    ) : (
                      <div className="overflow-hidden border border-gray-100 rounded-md bg-white divide-y divide-gray-100">
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
                              <div className="text-right">
                                <span className={`inline-block px-3 py-1.5 rounded-md text-lg font-black tracking-tight 
                                  ${grade.score >= 85 ? 'bg-green-50 text-green-600' :
                                    grade.score >= 70 ? 'bg-blue-50 text-blue-600' :
                                    'bg-orange-50 text-orange-600'}`}>
                                  {grade.score}%
                                </span>
                              </div>
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

      <DialogModal {...dialogConfig} onClose={closeDialog} />
    </DashboardLayout>
  );
}
