interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

const Badge = ({ children, variant = 'default', className = "" }: BadgeProps) => {
  const variants = {
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    error: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
    default: "bg-gray-100 text-gray-600"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
