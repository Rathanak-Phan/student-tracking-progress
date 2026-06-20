"use client";

import { useState } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  BellIcon,
  CircleStackIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'access' | 'security' | 'database'>('general');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);

  // General Settings state
  const [siteName, setSiteName] = useState('ST-Progress');
  const [institution, setInstitution] = useState('Central Academic University');
  const [supportEmail, setSupportEmail] = useState('support@centralacademy.edu');
  const [refreshInterval, setRefreshInterval] = useState(30); // in seconds
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Registration & Access settings state
  const [studentSelfReg, setStudentSelfReg] = useState(true);
  const [teacherVerification, setTeacherVerification] = useState(false); // require manual admin validation
  const [sessionTimeout, setSessionTimeout] = useState(60); // in minutes
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  // Notification and alerting settings
  const [alertOnLogin, setAlertOnLogin] = useState(true);
  const [alertOnDelete, setAlertOnDelete] = useState(true);
  const [alertOnGrading, setAlertOnGrading] = useState(false);

  const navItems = useNavItems();

  // Save changes handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Simulate database update request
    setTimeout(() => {
      setSaving(false);
      setSuccessMessage('System configuration saved successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1200);
  };

  // Mock Database actions
  const handleDownloadBackup = () => {
    setBackupLoading(true);
    setSuccessMessage(null);
    setTimeout(() => {
      setBackupLoading(false);
      setSuccessMessage('System SQL backup compiled and downloaded successfully!');
      
      // Simulate file download trigger
      const element = document.createElement("a");
      const file = new Blob(["-- ST-Progress SQL Backup File\n-- Created: " + new Date().toISOString() + "\n\nCREATE DATABASE IF NOT EXISTS student_tracking_system;"], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `st_progress_backup_${new Date().toISOString().slice(0,10)}.sql`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 2000);
  };

  const handleClearLogs = () => {
    if (!window.confirm("CRITICAL AUDIT ACTION: Are you sure you want to clear historical activity logs? This will truncate the activity_logs database table and cannot be undone.")) {
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMessage('Historical activity logs successfully cleared!');
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };

  return (
    <DashboardLayout navItems={navItems} title="System Configuration">
      <div className="space-y-8">
        
        {/* Top Header controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 p-6 md:p-8 rounded-3xl border border-blue-100/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight flex items-center gap-3">
              <Cog6ToothIcon className="h-9 w-9 text-blue-600" />
              System Configuration
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base max-w-2xl">Manage global preferences, self-registration controls, security policies, and backup operations for your institution.</p>
          </div>
        </div>

        {/* Global Notifications */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/60 text-green-700 font-bold text-sm rounded-2xl flex items-center gap-3 shadow-lg shadow-green-500/10"
            >
              <div className="p-1.5 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm">
                <CheckIcon className="h-4 w-4 stroke-2" />
              </div>
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 font-bold text-sm rounded-2xl flex items-center gap-3 shadow-lg shadow-red-500/10"
            >
              <div className="p-1.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-sm">
                <XMarkIcon className="h-4 w-4 stroke-2" />
              </div>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs (bento-box style) */}
          <div className="lg:col-span-4 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-1.5 relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'general' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'general' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <GlobeAltIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'general' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">General Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('access')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'access' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'access' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <UsersIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'access' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">Access & Registrations</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'security' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'security' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <ShieldCheckIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'security' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">Security & Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'database' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'database' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <CircleStackIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'database' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">Maintenance & Backups</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="lg:col-span-8 bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Tab 1: General Preferences */}
              {activeTab === 'general' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">General preferences</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Control how the platform displays, labels, and updates.</p>
                  </div>

                  <hr className="border-gray-100/80" />

                  {/* Site Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Platform Banner Title</label>
                    <input 
                      type="text" 
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 hover:border-gray-300 shadow-sm"
                    />
                  </div>

                  {/* Institution Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Institution Label</label>
                    <input 
                      type="text" 
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 hover:border-gray-300 shadow-sm"
                    />
                  </div>

                  {/* Support email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Help Desk Email</label>
                    <input 
                      type="email" 
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 hover:border-gray-300 shadow-sm"
                    />
                  </div>

                  {/* Polling Interval */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Live Notifications Polling (Seconds)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min={10}
                        max={120}
                        step={5}
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                      />
                      <span className="w-12 text-center text-xs font-bold text-gray-600 bg-gray-50 border px-2 py-1 rounded-md">
                        {refreshInterval}s
                      </span>
                    </div>
                  </div>

                  {/* Toggle Maintenance Mode */}
                  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200/60 hover:border-blue-200/60 transition-colors shadow-sm group">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">System Maintenance Mode</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Restrict student and instructor access to update infrastructure.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={maintenanceMode}
                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 shadow-inner"></div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Registrations & Access */}
              {activeTab === 'access' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Registration and Access policies</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Set validation guidelines and registration behaviors.</p>
                  </div>

                  <hr className="border-gray-100/80" />

                  {/* Student self registration */}
                  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200/60 hover:border-blue-200/60 transition-colors shadow-sm group">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Student Self Registration</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Allow public student email sign-ups.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={studentSelfReg}
                        onChange={(e) => setStudentSelfReg(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Teacher Validation */}
                  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200/60 hover:border-blue-200/60 transition-colors shadow-sm group">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Automatic Teacher Validation</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Approve new teacher registrations automatically without manual validation.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={teacherVerification}
                        onChange={(e) => setTeacherVerification(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Session Timeout */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Token Session Expiration (Minutes)</label>
                    <input 
                      type="number" 
                      min={15}
                      max={1440}
                      required
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                      className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 hover:border-gray-300 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Security & Alerts */}
              {activeTab === 'security' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Security & alerts preferences</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Control login throttle guidelines and dynamic notifications.</p>
                  </div>

                  <hr className="border-gray-100/80" />

                  {/* Max Login Attempts */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Maximum Login Failures Lockout threshold</label>
                    <input 
                      type="number" 
                      min={3}
                      max={15}
                      required
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                      className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 hover:border-gray-300 shadow-sm"
                    />
                  </div>

                  {/* Login Alerts Toggle */}
                  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200/60 hover:border-blue-200/60 transition-colors shadow-sm group">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Generate logs on authentication</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Log every user login or signout attempt in audit databases.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={alertOnLogin}
                        onChange={(e) => setAlertOnLogin(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Log on Destructive */}
                  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200/60 hover:border-blue-200/60 transition-colors shadow-sm group">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Generate logs on destruction</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Record critical user soft-deletions or class terminations.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={alertOnDelete}
                        onChange={(e) => setAlertOnDelete(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 shadow-inner"></div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Database Maintenance & Operations */}
              {activeTab === 'database' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Database and backup maintenance</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Generate system backups or perform audit purging operations.</p>
                  </div>

                  <hr className="border-gray-100/80" />

                  {/* Download Backup */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-blue-50/50 rounded-2xl border border-blue-100/60 gap-4 hover:border-blue-200 transition-colors">
                    <div>
                      <span className="block text-sm font-bold text-blue-900 uppercase tracking-wide">SQL Database Backup</span>
                      <p className="text-xs text-blue-600/80 font-semibold mt-1">Download structure and defaults schema backups.</p>
                    </div>
                    <button
                      type="button"
                      disabled={backupLoading}
                      onClick={handleDownloadBackup}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <ArrowDownTrayIcon className={`h-4.5 w-4.5 ${backupLoading ? 'animate-bounce' : ''}`} />
                      {backupLoading ? 'Compiling SQL...' : 'Download Backup'}
                    </button>
                  </div>

                  {/* Clear Activity Logs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-red-50/50 rounded-2xl border border-red-100/60 gap-4 hover:border-red-200 transition-colors">
                    <div>
                      <span className="block text-sm font-bold text-red-800 uppercase tracking-wide">Purge Audit Log Data</span>
                      <p className="text-xs text-red-600/80 font-semibold mt-1">Truncate historical data inside the activity_logs database table.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-500 hover:to-rose-500 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <TrashIcon className="h-4.5 w-4.5" />
                      Truncate Logs
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Submit footer button (only if not on database tab) */}
              {activeTab !== 'database' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end pt-6 border-t border-gray-100/80"
                >
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-gray-900/20 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {saving ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        Saving configurations...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </motion.div>
              )}

            </form>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
