import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  variant?: 'white' | 'dark' | 'gray';
}

const Card = ({ 
  title, 
  children, 
  className = "", 
  headerAction,
  variant = 'white'
}: CardProps) => {
  const variants = {
    white: "bg-white/95 backdrop-blur-xl border-gray-200/80 text-gray-900 shadow-sm shadow-gray-200/50",
    dark: "bg-[#0f172a]/95 backdrop-blur-xl border-gray-800 text-white shadow-xl shadow-blue-900/10",
    gray: "bg-gray-50/90 backdrop-blur-xl border-gray-200/80 text-gray-800"
  };

  return (
    <div className={`${variants[variant]} rounded-2xl border p-6 transition-all duration-300 hover:shadow-md ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-8">
          {title && (
            <h3 className={`text-lg font-semibold tracking-tight ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
          )}
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
