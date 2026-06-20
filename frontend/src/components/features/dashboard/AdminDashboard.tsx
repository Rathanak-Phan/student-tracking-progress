"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ServerIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import ActivityLog from '@/components/dashboard/ActivityLog';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navItems = useNavItems();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/admin');
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !data) {
    return (
      <DashboardLayout navItems={navItems} title="System Overview">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 text-sm font-medium tracking-wide">Loading Dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Total Users", value: data?.stats?.total_users || 0, icon: UsersIcon, trend: "+12.5%", trendUp: true },
    { label: "Total Teachers", value: data?.stats?.total_teachers || 0, icon: AcademicCapIcon, trend: "+5.2%", trendUp: true },
    { label: "Active Classes", value: data?.stats?.total_classes || 0, icon: ServerIcon, trend: "-1.1%", trendUp: false },
    { label: "Pending Verification", value: data?.stats?.pending_teachers || 0, icon: ShieldCheckIcon, alert: data?.stats?.pending_teachers > 0 },
  ];

  return (
    <DashboardLayout navItems={navItems} title="System Overview">
      
      {/* 1. TOP ACTION BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor your system health and key metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md">
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* 2. STATS GRID WITH TRENDS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics & Activity */}
        <div className="xl:col-span-2 space-y-8">
          {/* Platform Engagement Card */}
          <Card className="h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Platform Engagement</h3>
                <p className="text-sm text-gray-500">Daily active users over time.</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                <EllipsisHorizontalIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50/50 text-sm font-medium transition-colors hover:bg-gray-50">
              [ Analytics Chart Area - Recharts integration recommended here ]
            </div>
          </Card>

          <ActivityLog 
            activities={data?.recentActivities} 
            loading={loading} 
            onRefresh={fetchDashboardData}
          />
        </div>

        {/* Right Column: Pending Actions & System Health */}
        <div className="space-y-8">
          
          {/* Action Queue Component */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Action Queue</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {data?.stats?.pending_teachers || 0}
              </span>
            </div>
            
            <div className="space-y-3">
              {data?.stats?.pending_teachers > 0 ? (
                <>
                  <div className="group flex items-center justify-between p-3.5 border border-gray-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <ShieldCheckIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Pending Verifications</span>
                        <span className="text-xs text-gray-500">{data?.stats?.pending_teachers} teachers await approval</span>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-xs font-medium text-blue-600 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all shadow-sm">
                      Review
                    </button>
                  </div>
                  <button className="w-full mt-2 text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors py-2 flex items-center justify-center gap-1">
                    View all pending <span className="text-lg leading-none">&rarr;</span>
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">All caught up!</p>
                  <p className="text-xs text-gray-500 mt-1">No pending actions require your attention.</p>
                </div>
              )}
            </div>
          </Card>

          {/* System Status Component */}
          <Card variant="dark">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold tracking-tight text-white">System Status</h3>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">
                  <span>Database Load</span>
                  <span className="text-white">24%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: '24%' }} transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-emerald-500 h-full rounded-full" 
                  />
                </div>
              </div>
              
              <div className="group">
                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">
                  <span>Storage Capacity</span>
                  <span className="text-white">78%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-amber-400 h-full rounded-full" 
                  />
                </div>
              </div>
              
              <div className="group">
                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">
                  <span>API Latency</span>
                  <span className="text-white">42ms</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: '12%' }} transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-blue-500 h-full rounded-full" 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-gray-800">
              <button className="text-xs text-gray-400 hover:text-white transition-colors font-medium flex items-center justify-between w-full">
                <span>View Detailed Metrics</span>
                <span>&rarr;</span>
              </button>
            </div>
          </Card>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

