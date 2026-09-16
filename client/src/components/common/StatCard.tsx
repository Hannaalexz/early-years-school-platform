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
  colorScheme?: 'sage' | 'terracotta' | 'dustyrose' | 'forest' | 'amber' | 'primary' | 'turquoise' | 'coral' | 'honey';
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
  const schemeStyles: Record<string, { bg: string; iconBg: string; text: string }> = {
    primary: {
      bg: 'bg-white border-[#EFE9DF] hover:border-[#21B8AF]/40',
      iconBg: 'bg-[#E0F7F4] text-[#0B4E49] border border-[#C3EFEB]',
      text: 'text-[#0B4E49]',
    },
    turquoise: {
      bg: 'bg-white border-[#EFE9DF] hover:border-[#21B8AF]/40',
      iconBg: 'bg-[#E0F7F4] text-[#0B4E49] border border-[#C3EFEB]',
      text: 'text-[#0B4E49]',
    },
    sage: {
      bg: 'bg-white border-[#EFE9DF] hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      text: 'text-emerald-800',
    },
    forest: {
      bg: 'bg-white border-[#EFE9DF] hover:border-[#21B8AF]/40',
      iconBg: 'bg-[#E0F7F4] text-[#0B4E49] border border-[#C3EFEB]',
      text: 'text-[#0B4E49]',
    },
    terracotta: {
      bg: 'bg-white border-[#EFE9DF] hover:border-orange-300',
      iconBg: 'bg-orange-50 text-orange-800 border border-orange-200',
      text: 'text-orange-900',
    },
    dustyrose: {
      bg: 'bg-white border-[#EFE9DF] hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-800 border border-rose-200',
      text: 'text-rose-900',
    },
    amber: {
      bg: 'bg-white border-[#EFE9DF] hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200',
      text: 'text-amber-900',
    },
    coral: {
      bg: 'bg-white border-[#EFE9DF] hover:border-coral',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200',
      text: 'text-rose-800',
    },
    honey: {
      bg: 'bg-white border-[#EFE9DF] hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200',
      text: 'text-amber-900',
    },
  };

  const currentScheme = schemeStyles[colorScheme] || schemeStyles.primary;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-3xl p-4 border transition-all duration-200 shadow-xs hover:-translate-y-0.5',
        currentScheme.bg,
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-ink-500 font-['Quicksand'] truncate block">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-[#3D3530] mt-0.5 font-['Outfit'] tracking-tight">
            {value}
          </div>
        </div>
        <div className={clsx('w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs', currentScheme.iconBg)}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 pt-2 border-t border-[#F5F0E8] flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-[11px] text-ink-500 font-medium font-['Outfit'] truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={clsx(
                'font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0',
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
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
