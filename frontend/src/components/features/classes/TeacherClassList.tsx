"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import CreateClassModal from './CreateClassModal';
import EditClassModal from './EditClassModal';
import DialogModal from '@/components/ui/DialogModal';
import Link from 'next/link';

const ClassList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navItems = useNavItems();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleDelete = async () => {
    if (!selectedClass) return;
    try {
      await api.delete(`/classes/${selectedClass.id}`);
      fetchClasses();
    } catch (err) {
      console.error("Failed to delete class", err);
    } finally {
      setIsDeleteOpen(false);
      setSelectedClass(null);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
      <DashboardLayout navItems={navItems} title="Instructor Portal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <p className="text-gray-500">Manage your active classes and student enrollments</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Class
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search classes by name or code..." 
            className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-3 rounded-md border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm font-medium">
            <option>All Semesters</option>
            <option>Spring 2024</option>
            <option>Fall 2023</option>
          </select>
        </div>
      </div>

      {/* Class Grid */}
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold">Loading your classes...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No classes found. Create one to get started!</p>
          </div>
        ) : filteredClasses.map((item) => (
          <div key={item.id} className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 relative flex flex-col">
            <div 
              className={`h-32 ${item.is_active === 0 || item.is_active === false ? 'bg-gray-500' : 'bg-blue-500'} p-6 relative bg-cover bg-center shrink-0`}
              style={item.cover_image ? { backgroundImage: `url(http://localhost:5002${item.cover_image})` } : undefined}
            >
              {item.cover_image && <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>}
              <div className="absolute right-4 top-4 z-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === item.id ? null : item.id);
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                >
                  <EllipsisVerticalIcon className="h-5 w-5 text-white" />
                </button>
                {activeDropdown === item.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10">
                    <button 
                      onClick={() => {
                        setSelectedClass(item);
                        setIsEditOpen(true);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" /> Edit Details
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedClass(item);
                        setIsDeleteOpen(true);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" /> Delete Class
                    </button>
                  </div>
                )}
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-white/20 rounded-md text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md relative z-10">
                {item.code}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[40px]">
                {item.description || 'No description provided'}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">{item.student_count || 0} Enrolled</span>
                </div>
                <Link href={`/classes/${item.id}`}>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Manage</button>
                </Link>
              </div>
            </div>
          </div>
        ))}

      <CreateClassModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={fetchClasses} 
      />

      <EditClassModal 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setSelectedClass(null);
        }} 
        onSuccess={fetchClasses} 
        classId={selectedClass?.id || null}
        initialName={selectedClass?.name || ''}
        initialDescription={selectedClass?.description || ''}
      />

      <DialogModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedClass(null);
        }}
        onConfirm={handleDelete}
        title="Delete Class"
        message={`Are you sure you want to delete "${selectedClass?.name}"? This action cannot be undone.`}
        type="confirm"
        confirmText="Yes, Delete"
      />
    </DashboardLayout>
  );
};

export default ClassList;
