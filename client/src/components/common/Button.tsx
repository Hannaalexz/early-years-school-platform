import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terracotta' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1CA89E] hover:to-[#2BDAD2] text-white font-bold shadow-sm shadow-[#21B8AF]/30 focus:ring-[#38D3C7]',
    secondary: 'bg-[#E0F7F4] text-[#0B4E49] hover:bg-[#C3EFEB] font-bold focus:ring-[#38D3C7]',
    outline: 'border-2 border-[#C3EFEB] text-[#0B4E49] hover:bg-[#F0FBF9] font-bold focus:ring-[#38D3C7]',
    ghost: 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49] focus:ring-[#38D3C7]',
    terracotta: 'bg-gradient-to-r from-[#F47767] to-[#E85E50] text-white hover:from-[#E85E50] hover:to-[#DE4A3C] font-bold focus:ring-[#F47767] shadow-sm shadow-[#F47767]/25',
    danger: 'bg-dustyrose-500 text-white hover:bg-dustyrose-600 focus:ring-dustyrose-400',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
