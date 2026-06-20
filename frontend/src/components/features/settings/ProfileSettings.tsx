"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  AcademicCapIcon,
  CameraIcon,
  LockClosedIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DialogModal from '@/components/ui/DialogModal';
import Link from 'next/link';

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url?: string;
  role: string;
}

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
    role: user?.role || 'student'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [requestingTeacher, setRequestingTeacher] = useState(false);
  
  // Alert Feedbacks
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Modal State
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm' as 'confirm' | 'warning' | 'error' | 'success' | 'info',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const closeDialog = () => setDialogConfig(prev => ({ ...prev, isOpen: false }));
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch full user details from /users/me
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me');
        const data = response.data;
        setProfile({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          role: data.role || user?.role || 'student'
        });
        // Also sync context with the latest DB state on initial load
        if (data.avatar_url || data.first_name) {
            updateUser({ 
                avatar: data.avatar_url, 
                name: data.first_name || data.username 
            });
        }
      } catch (err) {
        console.error("Failed to load user profile settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]); // Only re-run if user.id changes, to avoid infinite loops

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Submit Profile Changes
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      setAlertMsg(null);
      
      const payload = {
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        phone: profile.phone.trim()
      };
      
      await api.put('/users/profile', payload);
      updateUser({ name: profile.first_name.trim() || profile.username });
      setAlertMsg({ type: 'success', text: 'Your profile information has been saved successfully!' });
    } catch (err: any) {
      console.error(err);
      setAlertMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile information.' });
    } finally {
      setSaving(false);
    }
  };

  // Submit Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setAlertMsg({ type: 'error', text: 'Image file size must be less than 10MB.' });
      return;
    }

    try {
      setUploading(true);
      setAlertMsg(null);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newAvatarUrl = response.data.avatar;
      
      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
      updateUser({ avatar: newAvatarUrl });
      setAlertMsg({ type: 'success', text: 'Your avatar image has been uploaded and updated!' });
    } catch (err: any) {
      console.error(err);
      setAlertMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload avatar image.' });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRequestTeacher = () => {
    setDialogConfig({
      isOpen: true,
      title: 'Request Teacher Role',
      message: 'Are you sure you want to request an upgrade to an instructor account? This requires administrator approval and you may be logged out once processed until approved.',
      type: 'confirm',
      confirmText: 'Yes, Submit Request',
      onConfirm: async () => {
        try {
          setRequestingTeacher(true);
          setAlertMsg(null);
          const response = await api.post('/users/request-teacher');
          setAlertMsg({ type: 'success', text: response.data.message || 'Teacher role requested successfully!' });
          setTimeout(() => {
             window.location.href = '/login?message=pending';
          }, 3000);
        } catch (err: any) {
          console.error(err);
          setAlertMsg({ type: 'error', text: err.response?.data?.message || 'Failed to request teacher role.' });
        } finally {
          setRequestingTeacher(false);
        }
      }
    });
  };

  // Role Capitalizer
  const roleDisplay = profile.role.toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your personal credentials, contact details, and platform avatar profile.</p>
      </div>

      {alertMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md flex items-center gap-3 border font-semibold text-sm shadow-sm
            ${alertMsg.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-700' 
              : 'bg-red-50 border-red-100 text-red-700'}`}
        >
          {alertMsg.type === 'success' 
            ? <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
            : <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 text-red-600" />}
          <p>{alertMsg.text}</p>
        </motion.div>
      )}

      {loading ? (
        <div className="bg-white p-10 rounded-md border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Retrieving Profile Credentials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile settings form (Bento 8-Span) */}
          <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-800 pb-2 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                Personal Credentials
              </h3>
              <p className="text-sm text-gray-500 mb-6">Update your basic profile information and how others see you on the platform.</p>
            </div>

            <form onSubmit={handleSubmitProfile} className="space-y-6 relative z-10">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600">First Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      name="first_name"
                      placeholder="e.g. Jane"
                      value={profile.first_name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600">Last Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      name="last_name"
                      placeholder="e.g. Doe"
                      value={profile.last_name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600">Phone Number</label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                    Secure Email <LockClosedIcon className="h-3 w-3 text-gray-400" />
                  </label>
                  <div className="relative group opacity-75">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="email" 
                      disabled
                      value={profile.email}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-500 font-medium rounded-xl outline-none text-sm cursor-not-allowed shadow-inner"
                    />
                  </div>
                  <span className="block text-[10px] text-gray-500 font-medium mt-1">Managed securely by system administrators.</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      Save Profile Info
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Dynamic Bento Profile card & Avatar Uploader (Bento 4-Span) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Bento 1: Avatar Image Uploader */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-800">Profile Image</h3>
                <p className="text-xs text-gray-500 mt-1">Click the avatar to upload a new one.</p>
              </div>
              
              <div 
                onClick={triggerFileInput}
                className="relative group w-36 h-36 rounded-full overflow-hidden shadow-md border-4 border-white ring-1 ring-gray-100 cursor-pointer transition-transform hover:scale-105 duration-300"
              >
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url.startsWith('http') ? profile.avatar_url : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002').replace('/api', '')}${profile.avatar_url}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 flex items-center justify-center font-bold text-5xl uppercase">
                    {profile.first_name ? profile.first_name.charAt(0) : profile.username.charAt(0)}
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-white">
                  {uploading ? (
                    <div className="h-8 w-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CameraIcon className="h-8 w-8 text-white drop-shadow-md" />
                      <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-md">Upload</span>
                    </>
                  )}
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  JPEG, PNG, GIF (Max 10MB)
                </span>
              </div>
            </div>

            {/* Bento 2: Dynamic Live Profile Preview Card */}
            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between h-64 relative overflow-hidden group">
              {/* Radial overlay */}
              <div className="absolute inset-0 bg-radial-gradient(ellipse at top right, rgba(99,102,241,0.15), transparent) pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <SparklesIcon className="h-8 w-8 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-widest backdrop-blur-md text-indigo-200 border border-white/5 shadow-inner">
                  {roleDisplay}
                </span>
              </div>

              <div className="z-10 my-4">
                <p className="text-xl font-black truncate drop-shadow-md">
                  {profile.first_name || profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile.username || 'Full Name'}
                </p>
                <p className="text-xs text-indigo-200 font-medium truncate mt-1">@{profile.username || 'username'}</p>
                {profile.phone && (
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-3">
                    <PhoneIcon className="h-3.5 w-3.5" />
                    {profile.phone}
                  </p>
                )}
              </div>

              <div className="z-10 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4.5 w-4.5 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Authenticated</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">ST-Progress</span>
              </div>
            </div>

            {/* Bento 3: Teacher Role Request (Only for students) */}
            {profile.role === 'student' && (
              <div className="bg-gradient-to-b from-white to-indigo-50/30 p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-indigo-900">Become an Instructor</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Want to create classes and track student progress? Request a teacher account upgrade.</p>
                </div>
                <Link
                  href="/student/settings/upgrade"
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
                >
                  <RocketLaunchIcon className="h-4 w-4 mr-2" />
                  Apply for Upgrade
                </Link>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {dialogConfig.isOpen && (
          <DialogModal
            isOpen={dialogConfig.isOpen}
            onClose={closeDialog}
            onConfirm={dialogConfig.onConfirm}
            title={dialogConfig.title}
            message={dialogConfig.message}
            type={dialogConfig.type}
            confirmText={dialogConfig.confirmText}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
