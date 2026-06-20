// components/Header.tsx
'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, User, Home, BookOpen, Users, ArrowRight, 
  LayoutDashboard, ClipboardList, TrendingUp, Info, LogOut, Plus,
  Bell, Award, MessageSquare, CheckCircle2, ChevronDown, Settings, 
  QrCode, Keyboard, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  interface LiveNotification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
  }

  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to fetch live notifications", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) setIsProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(target)) setIsNotificationsOpen(false);
      if (actionRef.current && !actionRef.current.contains(target)) setIsActionDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/" || href === "/student" || href === "/teacher") return pathname === href;
    return pathname.startsWith(href);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  // Filtered Nav Items based on requirements
  const navItems = [
    { name: "Dashboard", href: user?.role === 'teacher' ? '/teacher' : '/student', icon: LayoutDashboard },
    { name: "Classes", href: "/classes", icon: BookOpen },
    { name: "Assignments", href: user?.role === 'teacher' ? '/teacher/assignments' : '/student/assignments', icon: ClipboardList },
    { name: "Progress", href: user?.role === 'teacher' ? '/teacher/students' : '/student/progress', icon: TrendingUp },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-2" : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href={user ? (user.role === 'teacher' ? '/teacher' : '/student') : '/'} className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 tracking-tight hidden sm:block">ST.Progress</span>
            </Link>

            {user && (
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-3 py-1.5 text-sm font-medium transition-colors rounded ${
                        active ? "text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                      }`}
                    >
                      {item.name}
                      {active && (
                        <motion.div 
                          layoutId="active-nav"
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors">Log In</Link>
                <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-all shadow-sm">Get Started</Link>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="hidden md:flex items-center relative group">
                  <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-8 pr-10 py-1.5 bg-gray-100/50 border border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none rounded text-sm w-32 focus:w-48 transition-all duration-300 placeholder:text-gray-400"
                  />
                  <div className="absolute right-2 text-[10px] font-medium text-gray-400 border border-gray-200 px-1 rounded bg-white">⌘K</div>
                </div>

                <div className="flex items-center gap-1.5 border-l border-gray-200 ml-2 pl-3">
                  {/* Notifications */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className={`p-2 rounded transition-all relative ${
                        isNotificationsOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white"></span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-2xl border border-gray-200 overflow-hidden z-50 p-1"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-md">
                            <div>
                              <span className="text-xs font-bold text-gray-900">Notifications</span>
                              {unreadCount > 0 && (
                                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{unreadCount} unread alerts</p>
                              )}
                            </div>
                            {unreadCount > 0 && (
                              <button 
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                            {notifications.length === 0 ? (
                              <div className="py-8 flex flex-col items-center justify-center text-center">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-full mb-2">
                                  <Bell className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-bold text-gray-700">Inbox is Clean!</p>
                                <p className="text-[10px] text-gray-400 font-medium">You have no new alerts.</p>
                              </div>
                            ) : (
                              notifications.map((n) => (
                                <div 
                                  key={n.id} 
                                  onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                                  className={`p-3 hover:bg-gray-50/80 transition-colors flex gap-3 cursor-pointer relative group ${
                                    n.is_read ? '' : 'bg-blue-50/10'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 
                                    ${n.type === 'assignment' ? 'bg-purple-50 text-purple-600' :
                                      n.type === 'grade' ? 'bg-green-50 text-green-600' :
                                      n.type === 'class' ? 'bg-blue-50 text-blue-600' :
                                      'bg-indigo-50 text-indigo-600'}`}>
                                    {n.type === 'assignment' ? <ClipboardList className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-1 min-w-0 pr-4">
                                    <p className={`text-xs ${n.is_read ? 'text-gray-600 font-medium' : 'text-gray-900 font-bold'}`}>{n.title}</p>
                                    <p className="text-[10px] text-gray-500 line-clamp-1 font-semibold mt-0.5">{n.message}</p>
                                    <p className="text-[9px] text-gray-400 mt-1 font-bold">
                                      {new Date(n.created_at).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  {!n.is_read && <div className="absolute right-3 top-4 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Add Action Button */}
                  <div className="relative" ref={actionRef}>
                    <button
                      onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                      className={`p-2 rounded transition-all ${
                        isActionDropdownOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                      {isActionDropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 p-1.5 z-50"
                        >
                          <div className="px-2 py-1.5 mb-1">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</span>
                          </div>
                          
                          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left group">
                            <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                            Join Class
                          </button>

                          {user.role === 'teacher' ? (
                            <>
                              <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left group">
                                <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                Create Class
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left group">
                                <ClipboardList className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                Create Assignment
                              </button>
                            </>
                          ) : (
                            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left group">
                              <Award className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              Set Goal
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative ml-1" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                    >
                      <div className="h-7 w-7 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 overflow-hidden shadow-sm">
                        {user.avatar ? (
                          <img 
                            src={user.avatar.startsWith('http') ? user.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002').replace('/api', '')}${user.avatar}`} 
                            alt={user.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600">{getInitials(user.name)}</span>
                        )}
                      </div>
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 p-1.5 z-50"
                        >
                          <div className="px-3 py-2.5 mb-1.5 border-b border-gray-50">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1.5 truncate">{user.email || 'user@example.com'}</p>
                          </div>
                          
                          <Link href={`/${user.role}/settings`} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors group">
                            <User className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                            Profile & Settings
                          </Link>
                          <div className="h-px bg-gray-100 my-1 mx-1"></div>
                          <button 
                            onClick={logout}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors group"
                          >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              {!user ? (
                <div className="pt-4 flex flex-col gap-2">
                  <Link href="/login" className="w-full py-2.5 text-center text-sm font-medium text-gray-600 border border-gray-200 rounded-md">Log In</Link>
                  <Link href="/signup" className="w-full py-2.5 text-center text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm">Get Started</Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 mt-4 space-y-1">
                   <div className="px-3 py-2 flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow-sm border border-blue-200">
                      {user.avatar ? (
                        <img 
                          src={user.avatar.startsWith('http') ? user.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002').replace('/api', '')}${user.avatar}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{user.role}</p>
                    </div>
                  </div>
                  <Link href={`/${user.role}/settings`} onClick={() => setIsMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    Profile & Settings
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}