"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowRightIcon, 
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function GlobalSearchModal({ isOpen, onClose, navItems }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();
  
  const [dbResults, setDbResults] = useState<{ classes: any[], assignments: any[], users: any[] }>({ classes: [], assignments: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setDbResults({ classes: [], assignments: [], users: [] });
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced API Search
  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsLoading(true);
      const delay = setTimeout(async () => {
        try {
          const res = await api.get(`/dashboard/search?q=${encodeURIComponent(query)}`);
          setDbResults(res.data || { classes: [], assignments: [], users: [] });
        } catch (e) {
          console.error("Deep search failed", e);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setDbResults({ classes: [], assignments: [], users: [] });
      setIsLoading(false);
    }
  }, [query]);

  // Default Quick Actions
  const quickActions = [
    { name: "My Profile", action: () => router.push(`/${user?.role}/settings`), icon: UserCircleIcon },
    { name: "Account Settings", action: () => router.push(`/${user?.role}/settings`), icon: Cog6ToothIcon },
    { name: "Sign Out", action: () => { logout(); onClose(); }, icon: ArrowRightOnRectangleIcon, isDestructive: true },
  ];

  // Filter static items
  const filteredNavItems = navItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredQuickActions = quickActions.filter((item) => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = filteredNavItems.length > 0 || filteredQuickActions.length > 0 || dbResults.classes?.length > 0 || dbResults.assignments?.length > 0 || dbResults.users?.length > 0;

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const renderDbResult = (item: any, type: 'class' | 'assignment' | 'user', icon: any) => {
    let title = '';
    let subtitle = '';
    let href = '';

    if (type === 'class') {
      title = item.name;
      subtitle = `Class Code: ${item.code}`;
      href = `/${user?.role}/classes`; // Navigates to list to be safe
    } else if (type === 'assignment') {
      title = item.title;
      subtitle = item.description ? (item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description) : 'Assignment';
      href = `/${user?.role}/assignments`;
    } else {
      title = item.username;
      subtitle = item.email;
      href = `/${user?.role}/users`;
    }

    const Icon = icon;

    return (
      <button
        key={`${type}-${item.id}`}
        onClick={() => handleSelect(href)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 group transition-all text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-gray-50 group-hover:bg-blue-100 text-gray-500 group-hover:text-blue-600 rounded-lg transition-colors border border-gray-100 flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-gray-700 group-hover:text-blue-700 truncate">{title}</p>
            <p className="text-[10px] text-gray-500 truncate">{subtitle}</p>
          </div>
        </div>
        <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 flex-shrink-0" />
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[80vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-gray-100 bg-white flex-shrink-0">
              {isLoading ? (
                <div className="h-6 w-6 mr-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MagnifyingGlassIcon className="h-6 w-6 text-indigo-500 mr-3" />
              )}
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-lg focus:outline-none"
                placeholder="Deep search classes, assignments, users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-2">
              {hasResults ? (
                <div className="space-y-4 py-2">
                  {/* Database Deep Search Results */}
                  {dbResults.classes?.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-blue-500 uppercase bg-blue-50/50 inline-block rounded-md ml-3 mb-1">
                        Database • Classes
                      </p>
                      <div className="space-y-1">
                        {dbResults.classes.map(c => renderDbResult(c, 'class', BookOpenIcon))}
                      </div>
                    </div>
                  )}

                  {dbResults.assignments?.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-purple-500 uppercase bg-purple-50/50 inline-block rounded-md ml-3 mb-1">
                        Database • Assignments
                      </p>
                      <div className="space-y-1">
                        {dbResults.assignments.map(a => renderDbResult(a, 'assignment', ClipboardDocumentListIcon))}
                      </div>
                    </div>
                  )}

                  {dbResults.users?.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-green-500 uppercase bg-green-50/50 inline-block rounded-md ml-3 mb-1">
                        Database • Users
                      </p>
                      <div className="space-y-1">
                        {dbResults.users.map(u => renderDbResult(u, 'user', UsersIcon))}
                      </div>
                    </div>
                  )}

                  {/* Static Nav Results */}
                  {filteredNavItems.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-3 mb-1">
                        Navigation
                      </p>
                      <div className="space-y-1">
                        {filteredNavItems.map((item) => (
                          <button
                            key={item.href}
                            onClick={() => handleSelect(item.href)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-50 group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 group-hover:bg-indigo-100 text-gray-500 group-hover:text-indigo-600 rounded-lg transition-colors border border-gray-100 group-hover:border-indigo-200">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className="font-semibold text-gray-700 group-hover:text-indigo-700">
                                {item.name}
                              </span>
                            </div>
                            <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredQuickActions.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-3 mb-1">
                        Quick Actions
                      </p>
                      <div className="space-y-1">
                        {filteredQuickActions.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => {
                              item.action();
                              if (!item.isDestructive) onClose();
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl group transition-all ${
                              item.isDestructive ? 'hover:bg-red-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors border ${
                                item.isDestructive 
                                  ? 'bg-red-50 text-red-500 group-hover:bg-red-100 group-hover:text-red-600 border-red-100' 
                                  : 'bg-white text-gray-500 group-hover:text-gray-900 border-gray-200'
                              }`}>
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className={`font-semibold ${
                                item.isDestructive ? 'text-red-600' : 'text-gray-700 group-hover:text-gray-900'
                              }`}>
                                {item.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-14 text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 ring-1 ring-gray-100">
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-800 font-bold">No results found</p>
                  <p className="text-sm text-gray-500 mt-1">We couldn't find anything matching "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium flex-shrink-0">
              <span className="flex items-center gap-1">
                Deep search active across platform
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm font-bold text-gray-700">ESC</kbd>
                to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
