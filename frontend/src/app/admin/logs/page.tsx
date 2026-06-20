"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  FunnelIcon,
  ClockIcon,
  UserCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  NoSymbolIcon,
  CommandLineIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  created_at: string;
  username: string;
  email: string;
}

interface UserFilter {
  id: number;
  username: string;
  email: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<UserFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Search states
  const [actionSearch, setActionSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Selected log for detailed inspect modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const navItems = useNavItems();

  // Fetch users list to populate user filter dropdown
  const fetchUsersFilter = useCallback(async () => {
    try {
      setUsersLoading(true);
      // Fetch up to 100 users for selection
      const response = await api.get('/admin/users', { 
        params: { limit: 100 } 
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users for filter dropdown", err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch Activity Logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit,
      };
      if (actionSearch) params.action = actionSearch;
      if (selectedUserId) params.userId = selectedUserId;

      const response = await api.get('/admin/logs', { params });
      setLogs(response.data);
      setHasMore(response.data.length === limit);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve system logs');
    } finally {
      setLoading(false);
    }
  }, [page, limit, actionSearch, selectedUserId]);

  useEffect(() => {
    fetchUsersFilter();
  }, [fetchUsersFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset filters helper
  const handleClearFilters = () => {
    setActionSearch('');
    setSelectedUserId('');
    setPage(1);
  };

  // Helper to resolve custom badges & icons based on the action content
  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    
    if (act.includes('delete') || act.includes('remove') || act.includes('reject')) {
      return {
        text: 'Destructive',
        bg: 'bg-red-50 text-red-600 border border-red-100',
        icon: NoSymbolIcon
      };
    }
    if (act.includes('approve') || act.includes('validate') || act.includes('create') || act.includes('add')) {
      return {
        text: 'Creation',
        bg: 'bg-green-50 text-green-600 border border-green-100',
        icon: CheckCircleIcon
      };
    }
    if (act.includes('update') || act.includes('edit') || act.includes('modify')) {
      return {
        text: 'Modification',
        bg: 'bg-amber-50 text-amber-600 border border-amber-100',
        icon: DocumentTextIcon
      };
    }
    if (act.includes('login') || act.includes('sign in') || act.includes('auth')) {
      return {
        text: 'Authentication',
        bg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
        icon: LockClosedIcon
      };
    }
    if (act.includes('grade')) {
      return {
        text: 'Academic',
        bg: 'bg-purple-50 text-purple-600 border border-purple-100',
        icon: AcademicCapIcon
      };
    }
    if (act.includes('class') || act.includes('enroll')) {
      return {
        text: 'Classrooms',
        bg: 'bg-blue-50 text-blue-600 border border-blue-100',
        icon: BookOpenIcon
      };
    }
    return {
      text: 'System Action',
      bg: 'bg-gray-50 text-gray-600 border border-gray-100',
      icon: CommandLineIcon
    };
  };

  // Compute local stats from active dataset or general trends
  const computeStats = () => {
    const total = logs.length;
    const destructive = logs.filter(l => {
      const act = l.action.toLowerCase();
      return act.includes('delete') || act.includes('remove') || act.includes('reject');
    }).length;
    
    const modifications = logs.filter(l => {
      const act = l.action.toLowerCase();
      return act.includes('update') || act.includes('edit') || act.includes('modify');
    }).length;
    
    const academic = logs.filter(l => l.action.toLowerCase().includes('grade')).length;

    return { total, destructive, modifications, academic };
  };

  const currentStats = computeStats();

  return (
    <DashboardLayout navItems={navItems} title="System Activity Logs">
      <div className="space-y-8">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">System Activity Logs</h1>
            <p className="text-gray-500 font-medium mt-1">Audit user events, platform creations, updates, academic actions, and administrative actions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchLogs}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all font-semibold text-sm shadow-sm"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Audits
            </button>
          </div>
        </div>

        {/* Audit Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-md p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 bg-blue-100/60 rounded-md text-blue-600 shadow-inner">
                <ClockIcon className="h-6 w-6" />
              </span>
              <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Page Log Count</p>
            <p className="text-3xl font-black text-gray-800 mt-1">{currentStats.total}</p>
          </div>

          <div className="bg-red-50 rounded-md p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 bg-red-100/60 rounded-md text-red-600 shadow-inner">
                <NoSymbolIcon className="h-6 w-6" />
              </span>
              <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full">AUDITED</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Destructive Operations</p>
            <p className="text-3xl font-black text-gray-800 mt-1">{currentStats.destructive}</p>
          </div>

          <div className="bg-amber-50 rounded-md p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 bg-amber-100/60 rounded-md text-amber-600 shadow-inner">
                <DocumentTextIcon className="h-6 w-6" />
              </span>
              <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">CHANGES</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Database Modifications</p>
            <p className="text-3xl font-black text-gray-800 mt-1">{currentStats.modifications}</p>
          </div>

          <div className="bg-purple-50 rounded-md p-6 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 bg-purple-100/60 rounded-md text-purple-600 shadow-inner">
                <AcademicCapIcon className="h-6 w-6" />
              </span>
              <span className="text-[10px] font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">ACADEMICS</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Grading Activities</p>
            <p className="text-3xl font-black text-gray-800 mt-1">{currentStats.academic}</p>
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-md flex items-center gap-3 shadow-sm">
            <div className="p-1 rounded-full bg-red-500 text-white">
              <XMarkIcon className="h-4 w-4" />
            </div>
            {error}
          </div>
        )}

        {/* Filter Toolbar Panel */}
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Action Query Search */}
          <div className="relative w-full md:max-w-md group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search actions (e.g. login, create, update, delete)..."
              value={actionSearch}
              onChange={(e) => { setActionSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent text-gray-800 rounded-md outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* User Select & Limit Options */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Filter by User Dropdown */}
            <div className="flex items-center gap-2 bg-gray-50 border border-transparent rounded-md px-3 py-1 w-full sm:w-auto">
              <UsersIcon className="h-4 w-4 text-gray-400" />
              <select 
                value={selectedUserId}
                onChange={(e) => { setSelectedUserId(e.target.value); setPage(1); }}
                className="bg-transparent py-2 pr-8 text-xs font-bold text-gray-600 outline-none uppercase tracking-wider cursor-pointer max-w-[200px]"
                disabled={usersLoading}
              >
                <option value="">All Users</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Logs Limit Selector */}
            <div className="flex items-center gap-2 bg-gray-50 border border-transparent rounded-md px-3 py-1 w-full sm:w-auto">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select 
                value={limit}
                onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                className="bg-transparent py-2 pr-8 text-xs font-bold text-gray-600 outline-none uppercase tracking-wider cursor-pointer"
              >
                <option value={15}>15 Per Page</option>
                <option value={30}>30 Per Page</option>
                <option value={50}>50 Per Page</option>
              </select>
            </div>

            {/* Clear Button */}
            {(actionSearch || selectedUserId) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-black text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-all uppercase tracking-wider"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Logs Table Area */}
        <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Operator User</th>
                  <th className="px-6 py-4">Logged Operation</th>
                  <th className="px-6 py-4">Event Category</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
                            <div className="h-3 w-32 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-56 bg-gray-100 rounded-md"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-100 rounded-full"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded-md"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-gray-100 rounded-md ml-auto"></div></td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 mx-auto">
                        <ClockIcon className="h-8 w-8 text-gray-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700">No Audits Found</h3>
                      <p className="text-gray-400 text-sm font-medium mt-1">No logs match your selected filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const badge = getActionBadge(log.action);
                    return (
                      <tr key={log.id} className="hover:bg-blue-50/5 transition-all group">
                        {/* Operator User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 rounded-md flex items-center justify-center font-bold text-sm">
                              {log.username ? log.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">
                                {log.username || 'System User'}
                              </p>
                              <p className="text-xs text-gray-500 font-semibold">{log.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Action Log */}
                        <td className="px-6 py-4 font-semibold text-gray-700 text-sm">
                          {log.action}
                        </td>

                        {/* Event Category Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.bg}`}>
                            <badge.icon className="h-3.5 w-3.5" />
                            {badge.text}
                          </span>
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-600">
                            {new Date(log.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                            {new Date(log.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </p>
                        </td>

                        {/* Actions / Inspect */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            title="Inspect Log Details"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                          >
                            <EyeIcon className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
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

      {/* INSPECT LOG MODAL */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-md p-8 border border-gray-100 shadow-2xl z-10 space-y-6 overflow-hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-md">
                    <DocumentMagnifyingGlassIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Inspect Audit Entry</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Audit ID: #{selectedLog.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Inspect Grid */}
              <div className="space-y-4">
                {/* Operator Details */}
                <div className="bg-gray-50/50 p-4 rounded-md border border-gray-100/50">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Operator Identity</span>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold text-sm">
                      {selectedLog.username ? selectedLog.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{selectedLog.username || 'System User'}</p>
                      <p className="text-xs text-gray-500 font-semibold">{selectedLog.email || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">User Database ID: {selectedLog.user_id}</p>
                    </div>
                  </div>
                </div>

                {/* Operation Details */}
                <div className="bg-gray-50/50 p-4 rounded-md border border-gray-100/50 space-y-3">
                  <div>
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logged Operation</span>
                    <p className="text-sm font-bold text-gray-800">{selectedLog.action}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Entity Type</span>
                      <span className="text-xs font-semibold text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-100 inline-block mt-1">
                        {selectedLog.entity_type || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Entity Target ID</span>
                      <span className="text-xs font-semibold text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-100 inline-block mt-1">
                        {selectedLog.entity_id || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timing Details */}
                <div className="bg-gray-50/50 p-4 rounded-md border border-gray-100/50">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Audit Timestamp</span>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        {new Date(selectedLog.created_at).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">
                        Time: {new Date(selectedLog.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          timeZoneName: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-bold text-sm transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
