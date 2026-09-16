import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  headerBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  headerBorder = false,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-3xl border border-[#EFE9DF] shadow-xs overflow-hidden transition-all',
          className
        )
      )}
      {...props}
    >
      {(title || action) && (
        <div
          className={clsx(
            'px-5 py-3.5 flex items-center justify-between',
            headerBorder && 'border-b border-[#F0ECE4]'
          )}
        >
          <div>
            {title && (
              <h3 className="font-bold text-[#3D3530] text-sm font-['Quicksand']">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-ink-500 mt-0.5 font-['Outfit']">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
