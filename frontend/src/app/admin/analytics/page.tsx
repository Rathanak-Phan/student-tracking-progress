"use client";

import { useState, useEffect } from 'react';
import { 
  PresentationChartLineIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import { adminService } from '@/services/adminService';

export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState('month'); // week, month, year
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navItems = useNavItems();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout navItems={navItems} title="Analytics Dashboard">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Visualize platform growth, student engagement, and systemic submission rates.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 p-1 rounded-md">
              <button 
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeFilter('year')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'year' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : (
          <>
            {/* Highlight Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md p-6 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 bg-white/20 rounded-md">
                    <UsersIcon className="h-6 w-6" />
                  </span>
                  <span className="px-2.5 py-1 bg-green-400/20 text-green-300 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1 border border-green-400/30">
                    <ArrowTrendingUpIcon className="h-3 w-3" /> +15.2%
                  </span>
                </div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Total Users</p>
                <p className="text-4xl font-black mt-1">{stats?.totalUsers?.toLocaleString() || 0}</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-md p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 bg-green-50 text-green-600 rounded-md">
                    <AcademicCapIcon className="h-6 w-6" />
                  </span>
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-green-100">
                    Healthy
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Students</p>
                <p className="text-4xl font-black text-gray-800 mt-1">{stats?.totalStudents?.toLocaleString() || 0}</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-md p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 bg-orange-50 text-orange-600 rounded-md">
                    <ChartBarIcon className="h-6 w-6" />
                  </span>
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-orange-100 flex items-center gap-1">
                    <ArrowTrendingUpIcon className="h-3 w-3" /> +4.1%
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Global Submission Rate</p>
                <p className="text-4xl font-black text-gray-800 mt-1">{stats?.globalSubmissionRate || 0}%</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* User Growth Chart */}
              <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                      <PresentationChartLineIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">User Growth Trends</h3>
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="flex-1 border-2 border-dashed border-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                  <PresentationChartLineIcon className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm font-bold uppercase tracking-widest">Growth Chart Data Area</p>
                  <p className="text-xs font-medium mt-1 max-w-[200px] text-center text-gray-400">Integrate a chart library like Recharts here</p>
                </div>
              </div>

              {/* Submission Rate Chart */}
              <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                      <DocumentCheckIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Submission Analytics</h3>
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="flex-1 border-2 border-dashed border-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                  <ChartBarIcon className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm font-bold uppercase tracking-widest">Submission Rate Data</p>
                  <p className="text-xs font-medium mt-1 max-w-[200px] text-center text-gray-400">Integrate a chart library like Recharts here</p>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function DocumentCheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
  );
}
