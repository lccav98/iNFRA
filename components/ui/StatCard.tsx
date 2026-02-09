import React, { memo } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard = memo<StatCardProps>(({ 
  title, 
  value, 
  icon, 
  iconColor = 'text-blue-500',
  trend,
  onClick,
  className = ''
}) => {
  const baseClass = "bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm transition-all";
  const interactiveClass = onClick ? "cursor-pointer hover:border-primary/50 hover:shadow-md" : "";

  return (
    <div 
      className={`${baseClass} ${interactiveClass} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`h-10 w-10 rounded-lg ${iconColor}/10 ${iconColor} flex items-center justify-center`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {onClick && (
          <span className="material-symbols-outlined text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
            open_in_new
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black mt-1">{value}</h3>
      {trend && (
        <div className="mt-2 text-xs font-bold text-slate-400">
          <span className={trend.value > 0 ? 'text-green-500' : 'text-red-500'}>
            {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          {' '}{trend.label}
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';
