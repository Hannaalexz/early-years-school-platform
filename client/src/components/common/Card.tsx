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
          'bg-white rounded-2xl border border-ivory-300 shadow-subtle overflow-hidden',
          className
        )
      )}
      {...props}
    >
      {(title || action) && (
        <div
          className={clsx(
            'px-6 py-4 flex items-center justify-between',
            headerBorder && 'border-b border-ivory-200'
          )}
        >
          <div>
            {title && <h3 className="font-bold text-ink-800 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
