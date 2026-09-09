import React from 'react';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'sage' | 'terracotta' | 'dustyrose' | 'forest' | 'amber' | 'primary' | 'turquoise';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'primary',
  onClick,
}) => {
  const iconBackgrounds = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    turquoise: 'bg-primary-100 text-primary-700 border border-primary-200',
    sage: 'bg-primary-100 text-primary-800 border border-primary-200',
    forest: 'bg-primary-100 text-primary-900 border border-primary-200',
    terracotta: 'bg-terracotta-100 text-terracotta-600',
    dustyrose: 'bg-dustyrose-100 text-dustyrose-500',
    amber: 'bg-amber-100 text-amber-800',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl p-5 border border-ivory-300 shadow-subtle transition-card',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
            {value}
          </div>
        </div>
        <div className={clsx('p-3 rounded-xl', iconBackgrounds[colorScheme])}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {subtitle && <span className="text-ink-500">{subtitle}</span>}
          {trend && (
            <span
              className={clsx(
                'font-bold px-2 py-0.5 rounded-md text-[11px]',
                trend.isPositive ? 'bg-primary-100 text-primary-900 border border-primary-200' : 'bg-dustyrose-100 text-dustyrose-600'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
