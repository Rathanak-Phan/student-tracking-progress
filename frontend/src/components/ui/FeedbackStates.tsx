import { ArrowPathIcon, ExclamationTriangleIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// --- Error Mapping Utility ---
export const mapErrorMessage = (error: any): string => {
  if (typeof error !== 'string') {
    // Log technical error for developers
    console.error('[Dashboard Error]:', error);
    
    // Check for specific backend errors and map to friendly messages
    const message = error.response?.data?.message || error.message || '';
    
    if (message.includes('Unknown column') || message.includes('field list') || message.includes('SQL')) {
      return "We encountered a temporary database issue. Our team has been notified.";
    }
    if (message.includes('404')) {
      return "The requested dashboard data could not be found.";
    }
    if (message.includes('401') || message.includes('403')) {
      return "You don't have permission to view this data. Please log in again.";
    }
    if (message.includes('Network Error') || !window.navigator.onLine) {
      return "Check your internet connection and try again.";
    }
    
    return "We couldn’t load your dashboard data. Please try again.";
  }
  return error;
};

// --- Error State Component ---
export const ErrorState = ({ error, onRetry, title = "Something went wrong" }: { error: any, onRetry?: () => void, title?: string }) => {
  const friendlyMessage = mapErrorMessage(error);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/50 rounded-md border border-gray-100 max-w-2xl mx-auto"
    >
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
        <ExclamationTriangleIcon className="h-10 w-10 text-amber-500/70" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-md leading-relaxed">{friendlyMessage}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-blue-600 transition-all shadow-sm flex items-center gap-2 group"
          >
            <ArrowPathIcon className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            Retry
          </button>
        )}
        <a 
          href="/classes"
          className="px-6 py-2.5 bg-white text-gray-600 text-sm font-semibold rounded-md border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Go to Classes
        </a>
        <button className="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-all">
          Contact Support
        </button>
      </div>
    </motion.div>
  );
};

// --- Loading State Component ---
export const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-6 text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">{message}</p>
  </div>
);

// --- Skeleton Components ---
export const StatSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-32 bg-white rounded-md border border-gray-100 p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-md"></div>
          <div className="w-12 h-6 bg-gray-100 rounded-md"></div>
        </div>
        <div className="w-24 h-4 bg-gray-100 rounded-full"></div>
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="bg-white rounded-md border border-gray-100 p-8 animate-pulse">
    <div className="w-48 h-6 bg-gray-100 rounded-full mb-8"></div>
    <div className="space-y-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-4 bg-gray-100 rounded-full"></div>
            <div className="w-1/2 h-3 bg-gray-100 rounded-full opacity-60"></div>
          </div>
          <div className="w-16 h-8 bg-gray-100 rounded-md"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ProgressSkeleton = () => (
  <div className="bg-white rounded-md border border-gray-100 p-8 animate-pulse h-full">
    <div className="w-32 h-6 bg-gray-100 rounded-full mb-10 mx-auto"></div>
    <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
      <div className="w-32 h-32 bg-white rounded-full"></div>
    </div>
    <div className="w-2/3 h-4 bg-gray-100 rounded-full mx-auto mb-2"></div>
    <div className="w-1/2 h-3 bg-gray-100 rounded-full mx-auto opacity-60"></div>
  </div>
);

export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="h-16 bg-white rounded-md border border-gray-100 p-4 animate-pulse flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
        <div className="flex-1 space-y-2">
          <div className="w-1/4 h-3 bg-gray-100 rounded-full"></div>
          <div className="w-1/2 h-2 bg-gray-100 rounded-full opacity-60"></div>
        </div>
      </div>
    ))}
  </div>
);
