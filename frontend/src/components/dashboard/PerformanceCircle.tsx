interface PerformanceCircleProps {
  percentage: number;
  label?: string;
  sublabel?: string;
  color?: string;
  bgColor?: string;
  size?: number;
}

const PerformanceCircle = ({ 
  percentage, 
  label = "Grade", 
  sublabel,
  color = "#3b82f6",
  bgColor = "rgba(255,255,255,0.05)",
  size = 44
}: PerformanceCircleProps) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative w-${size} h-${size}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" 
            stroke={bgColor} 
            strokeWidth="10"
          />
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            {percentage}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{label}</span>
        </div>
      </div>
      {sublabel && (
        <p className="mt-6 text-sm font-medium text-gray-400 text-center">
          {sublabel}
        </p>
      )}
    </div>
  );
};

export default PerformanceCircle;
