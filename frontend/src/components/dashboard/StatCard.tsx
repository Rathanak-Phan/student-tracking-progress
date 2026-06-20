import { ElementType } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  color?: string;
  textColor?: string;
  bgColor?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  progress?: {
    value: number;
    label?: string;
  };
}

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color = "bg-gray-100", 
  textColor = "text-gray-600", 
  bgColor = "bg-white",
  progress
}: StatCardProps) => {
  return (
    <div className={`${bgColor} rounded-2xl shadow-sm p-6 border border-gray-200/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/60 group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${color} group-hover:bg-blue-50`}>
          <Icon className={`h-5 w-5 ${textColor} group-hover:text-blue-600`} />
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1 tracking-tight">{label}</p>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
      </div>
      
      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
            <span>{progress.label || 'Progress'}</span>
            <span className={textColor}>{progress.value}%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${progress.value}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
