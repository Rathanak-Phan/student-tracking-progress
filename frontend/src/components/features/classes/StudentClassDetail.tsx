"use client";

import { useState } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  CalendarDaysIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';

const ClassList = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const navItems = useNavItems();

  const classes = [
    {
      id: 1,
      subject: 'Algebra II',
      period: 'Period 1',
      teacher: 'Ms. Johnson',
      time: '8:00 AM - 9:30 AM',
      room: 'Room 204',
      assignments: 18,
      nextClass: 'Monday, 8:00 AM',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      subject: 'English Literature',
      period: 'Period 2',
      teacher: 'Mr. Thompson',
      time: '9:45 AM - 11:15 AM',
      room: 'Room 310',
      assignments: 15,
      nextClass: 'Monday, 9:45 AM',
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      subject: 'Chemistry',
      period: 'Period 3',
      teacher: 'Dr. Martinez',
      time: '11:30 AM - 1:00 PM',
      room: 'Lab 102',
      assignments: 20,
      nextClass: 'Tuesday, 11:30 AM',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <p className="text-gray-500 font-medium">Spring Semester 2025</p>
        </div>
        <button 
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold"
        >
          <PlusIcon className="h-5 w-5" />
          Join New Class
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
            <AcademicCapIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enrolled</p>
            <p className="text-xl font-black text-gray-800">{classes.length} Classes</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
            <ClipboardIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Tasks</p>
            <p className="text-xl font-black text-gray-800">53 Assignments</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center text-green-600">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance</p>
            <p className="text-xl font-black text-gray-800">98.5% Avg.</p>
          </div>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className={`h-32 ${cls.color} p-8 relative overflow-hidden`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white italic tracking-tight">{cls.subject}</h3>
                <p className="text-white/80 font-bold text-xs uppercase tracking-widest mt-1">{cls.period}</p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 group/item">
                  <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-600">{cls.teacher}</span>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
                    <ClockIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-600">{cls.time}</span>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
                    <MapPinIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-600">{cls.room}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                    <CalendarDaysIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Next Class</p>
                    <p className="text-xs font-bold text-gray-800">{cls.nextClass.split(', ')[1]}</p>
                  </div>
                </div>
                <button className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
                  Open Class
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Join Class Modal (Placeholder UI) */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowJoinModal(false)}></div>
          <div className="relative bg-white rounded-md shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-gray-800 mb-2">Join a Class</h2>
            <p className="text-gray-500 text-sm mb-6">Enter the class code provided by your instructor.</p>
            
            <input 
              type="text" 
              placeholder="e.g. MATH-2024" 
              className="w-full px-6 py-4 rounded-md border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-lg mb-6 tracking-widest uppercase transition-all"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-4 rounded-md bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-4 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Join Class
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClassList;