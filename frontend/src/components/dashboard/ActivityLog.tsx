"use client";

import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  CheckBadgeIcon,
  ClockIcon,
  UserPlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: number;
  action: string;
  created_at: string;
}

interface ActivityLogProps {
  activities: Activity[];
  loading?: boolean;
  onRefresh?: () => void;
}

const ActivityLog = ({ activities, loading, onRefresh }: ActivityLogProps) => {
  const getIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('joined class')) return { icon: UserPlusIcon, color: 'text-blue-500', bg: 'bg-blue-50' };
    if (a.includes('submitted assignment')) return { icon: DocumentTextIcon, color: 'text-purple-500', bg: 'bg-purple-50' };
    if (a.includes('received grade')) return { icon: CheckBadgeIcon, color: 'text-green-500', bg: 'bg-green-50' };
    return { icon: ClockIcon, color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Activity</h3>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-blue-600"
            disabled={loading}
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>

        <div className="space-y-8">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => {
              const { icon: Icon, color, bg } = getIcon(activity.action);
              return (
                <div key={activity.id || index} className="relative flex gap-6 items-start group">
                  {/* Icon Node */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-md bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-200 transition-all duration-200 group-hover:shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <h4 className="font-medium text-sm text-gray-900">
                        {activity.action}
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {new Date(activity.created_at).toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                <ClockIcon className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No activity recorded yet</p>
            </div>
          )}
        </div>
      </div>

      {activities && activities.length > 5 && (
        <button className="w-full mt-8 py-2.5 rounded-md bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-200">
          View All History
        </button>
      )}
    </div>
  );
};

export default ActivityLog;
