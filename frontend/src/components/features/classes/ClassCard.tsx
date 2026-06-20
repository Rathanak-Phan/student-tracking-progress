"use client";

import { AcademicCapIcon, UserIcon, ClipboardDocumentListIcon, ArrowRightIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface ClassCardProps {
  id: number;
  name: string;
  teacher_name?: string;
  student_count?: number;
  total_assignments?: number;
  completed_assignments?: number;
  total_earned_score?: number;
  total_max_score?: number;
  role: 'teacher' | 'student';
  code?: string;
  cover_image?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ClassCard = ({ id, name, teacher_name, student_count, total_assignments, completed_assignments, total_earned_score, total_max_score, role, code, cover_image, onEdit, onDelete }: ClassCardProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const progress = total_assignments && total_assignments > 0 
    ? Math.round(((completed_assignments || 0) / total_assignments) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col overflow-hidden">
      <div 
        className="h-32 w-full bg-cover bg-center relative shrink-0"
        style={{ 
          backgroundImage: cover_image ? `url(http://localhost:5002${cover_image})` : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' 
        }}
      >
        {!cover_image && (
          <div className="absolute inset-0 flex items-center justify-center opacity-50">
            <AcademicCapIcon className="h-12 w-12 text-blue-200" />
          </div>
        )}
        
        {role === 'teacher' && code && (
          <div className="absolute top-4 right-4 flex items-start gap-3 text-right">
            <div>
              <span className="text-[10px] font-bold text-white drop-shadow-md uppercase tracking-widest block mb-1">Class Code</span>
              <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider">{code}</span>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1.5 bg-white/50 hover:bg-white backdrop-blur-sm rounded-md transition-colors shadow-sm"
              >
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-700" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10">
                  <button 
                    onClick={() => { setDropdownOpen(false); onEdit?.(id); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" /> Edit Class
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); onDelete?.(id); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" /> Delete Class
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          {cover_image && (
            <div className="p-2 bg-blue-50 rounded-md shrink-0">
              <AcademicCapIcon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{name}</h3>
        </div>
      <p className="text-sm text-gray-500 font-medium mb-6">
        {role === 'teacher' ? (
          <span className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            {student_count || 0} Students enrolled
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            Instructor: {teacher_name}
          </span>
        )}
      </p>

      {role === 'student' && (
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-tighter">
            <span>Progress</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase">
            <span>{completed_assignments || 0} / {total_assignments || 0} Assignments Completed</span>
            {(total_max_score || 0) > 0 && (
              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Score: {total_earned_score || 0} / {total_max_score}
              </span>
            )}
          </div>
        </div>
      )}

      {role === 'teacher' && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1 p-3 bg-gray-50 rounded-md">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Students</p>
            <p className="text-lg font-bold text-gray-800">{student_count || 0}</p>
          </div>
          <div className="flex-1 p-3 bg-gray-50 rounded-md">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tasks</p>
            <p className="text-lg font-bold text-gray-800">{total_assignments || 0}</p>
          </div>
        </div>
      )}

        <Link href={`/classes/${id}`} className="mt-auto">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-gray-900 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
            View Details
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
