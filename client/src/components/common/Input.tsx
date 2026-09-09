import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-ink-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={twMerge(
          clsx(
            'w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-xl text-ink-900 text-sm placeholder-ink-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent',
            error && 'border-dustyrose-500 focus:ring-dustyrose-400',
            className
          )
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-dustyrose-500 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-ink-400">{helperText}</p>}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  id,
  className,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-ink-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={twMerge(
          clsx(
            'w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-xl text-ink-900 text-sm',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent',
            error && 'border-dustyrose-500',
            className
          )
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-dustyrose-500 font-medium">{error}</p>}
    </div>
  );
};
