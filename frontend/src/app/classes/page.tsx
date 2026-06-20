"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  AcademicCapIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClassCard from '@/components/features/classes/ClassCard';
import CreateClassModal from '@/components/features/classes/CreateClassModal';
import EditClassModal from '@/components/features/classes/EditClassModal';
import JoinClassModal from '@/components/features/classes/JoinClassModal';
import DialogModal from '@/components/ui/DialogModal';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useNavItems } from '@/hooks/useNavItems';

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navItems = useNavItems();

  // Check for join link parameter
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.role === 'student') {
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get('join');
      if (joinCode) {
        setInitialJoinCode(joinCode);
        setIsJoinModalOpen(true);
        
        // Clean up the URL to prevent reopening on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [user]);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load classes');
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete class');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedClass(null);
    }
  };

  const handleEditOpen = (id: number) => {
    const cls = classes.find(c => c.id === id);
    if (cls) {
      setSelectedClass(cls);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteOpen = (id: number) => {
    const cls = classes.find(c => c.id === id);
    if (cls) {
      setSelectedClass(cls);
      setIsDeleteModalOpen(true);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} title="Class Management">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
            <p className="text-gray-500 font-medium mt-1">Manage and track your educational progress</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'teacher' ? (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <PlusIcon className="h-5 w-5" />
                Create Class
              </button>
            ) : (
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
              >
                <PlusIcon className="h-5 w-5" />
                Join Class
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8">
          <div className="md:col-span-8 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search classes..."
              className="w-full pl-12 pr-4 py-4 rounded-md border border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-100 px-4 py-4 rounded-md font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <FunnelIcon className="h-5 w-5" />
              Filter
            </button>
            <button 
              onClick={fetchClasses}
              className="p-4 bg-white border border-gray-100 rounded-md text-gray-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading && classes.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-md p-8 h-64 animate-pulse border border-gray-50">
              <div className="w-12 h-12 bg-gray-100 rounded-md mb-6"></div>
              <div className="w-3/4 h-6 bg-gray-100 rounded-md mb-4"></div>
              <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-8 rounded-md border border-red-100 text-center">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button onClick={fetchClasses} className="bg-red-600 text-white px-6 py-2 rounded-md font-bold">Try Again</button>
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((item) => (
            <ClassCard 
              key={item.id}
              {...item}
              role={user?.role as any}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-md p-16 text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AcademicCapIcon className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No classes found</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {searchQuery ? "We couldn't find any classes matching your search." : user?.role === 'teacher' ? "You haven't created any classes yet. Start by creating your first one!" : "You haven't joined any classes yet. Use a code to join a class."}
          </p>
          {user?.role === 'teacher' ? (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Create First Class
            </button>
          ) : (
            <button 
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-gray-900 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
            >
              Join a Class
            </button>
          )}
        </div>
      )}

      <CreateClassModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchClasses}
      />
      <EditClassModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClass(null);
        }} 
        onSuccess={fetchClasses} 
        classId={selectedClass?.id || null}
        initialName={selectedClass?.name || ''}
        initialDescription={selectedClass?.description || ''}
      />
      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClass(null);
        }}
        onConfirm={handleDelete}
        title="Delete Class"
        message={`Are you sure you want to delete "${selectedClass?.name}"? This action cannot be undone.`}
        type="confirm"
        confirmText="Yes, Delete"
      />
      <JoinClassModal 
        isOpen={isJoinModalOpen} 
        onClose={() => {
          setIsJoinModalOpen(false);
          setInitialJoinCode(''); // Reset on close
        }} 
        onSuccess={fetchClasses}
        initialCode={initialJoinCode}
      />
    </DashboardLayout>
  );
}
