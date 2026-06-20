import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
}

export default function StatCard({ label, value, icon: Icon, trend, trendUp = true, alert }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {trendUp ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
            <span>{trend}</span>
          </div>
        )}
        {alert && (
          <span className="flex h-2.5 w-2.5 relative mt-1.5 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
        </div>
      </div>
    </motion.div>
  );
}
