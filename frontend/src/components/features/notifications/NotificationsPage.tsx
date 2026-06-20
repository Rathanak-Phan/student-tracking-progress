"use client";

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon,
  ClockIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.is_read) {
      handleMarkAsRead(n.id);
    }
    if (n.link) {
      router.push(n.link);
    } else if (n.type === 'message') {
      router.push(`/${user?.role}/messages`);
    }
  };

  const formatTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'grade': return <AcademicCapIcon className="h-6 w-6 text-green-600" />;
      case 'assignment': return <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />;
      case 'class': return <BookOpenIcon className="h-6 w-6 text-blue-600" />;
      case 'message': return <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />;
      default: return <InformationCircleIcon className="h-6 w-6 text-indigo-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'grade': return 'bg-green-50';
      case 'assignment': return 'bg-purple-50';
      case 'class': return 'bg-blue-50';
      case 'message': return 'bg-indigo-50';
      default: return 'bg-indigo-50';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.is_read) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Notifications Center
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full animate-pulse">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Review your system alerts, messages, and updates in detail.</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-sm transition-colors"
          >
            <CheckIcon className="h-5 w-5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100/80 p-1 rounded-lg w-full sm:w-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`flex-1 sm:px-6 py-2 rounded-md font-bold text-sm transition-all ${filter === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Alerts
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`flex-1 sm:px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 ${filter === 'unread' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Unread
            {unreadCount > 0 && filter !== 'unread' && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        <AnimatePresence initial={false}>
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-16 text-center"
            >
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BellIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No notifications found</h3>
              <p className="text-gray-500 mt-1 max-w-sm">
                {searchQuery ? "Try adjusting your search terms." : "You're all caught up! There are no new alerts at this time."}
              </p>
            </motion.div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((n) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-5 flex items-start gap-4 transition-all cursor-pointer group hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50/20' : ''}`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 mt-1 ${getBg(n.type)} shadow-sm border border-white`}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className={`text-base tracking-tight ${!n.is_read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                          {n.title}
                        </h4>
                        <p className={`mt-1 text-sm ${!n.is_read ? 'text-gray-600 font-medium' : 'text-gray-500'} leading-relaxed`}>
                          {n.message}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold whitespace-nowrap">
                        <ClockIcon className="h-4 w-4" />
                        {formatTime(n.created_at)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-600 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <CheckIcon className="h-4 w-4" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {!n.is_read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-2.5 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
