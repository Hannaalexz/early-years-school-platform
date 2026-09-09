import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: 
    | 'success' // Achieved / Present
    | 'warning' // Developing / Late
    | 'neutral' // Emerging
    | 'danger'  // Absent / Alert
    | 'info'    // Info / Class
    | 'terracotta'
    | 'role';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    success: 'bg-[#E0F7F4] text-[#0B4E49] border border-[#C3EFEB]',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    neutral: 'bg-ivory-200 text-ink-700 border border-ivory-300',
    danger: 'bg-dustyrose-50 text-dustyrose-500 border border-dustyrose-200',
    info: 'bg-sky-50 text-sky-800 border border-sky-200',
    terracotta: 'bg-terracotta-100 text-terracotta-600 border border-terracotta-200',
    role: 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white font-bold shadow-xs',
  };

  const dotColors = {
    success: 'bg-forest-600',
    warning: 'bg-amber-500',
    neutral: 'bg-ink-400',
    danger: 'bg-dustyrose-500',
    info: 'bg-sky-500',
    terracotta: 'bg-terracotta-500',
    role: 'bg-white',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
