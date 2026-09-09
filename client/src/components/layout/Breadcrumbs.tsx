import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath, onNavigate }) => {
  const parts = currentPath.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-ink-500 py-3 px-4 sm:px-6">
      <button
        onClick={() => onNavigate('/dashboard')}
        className="hover:text-forest-800 flex items-center gap-1 transition-colors"
      >
        <Home size={14} />
        <span className="font-medium">Home</span>
      </button>

      {parts.map((part, index) => {
        const fullPath = '/' + parts.slice(0, index + 1).join('/');
        const isLast = index === parts.length - 1;
        const formatted = part
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <React.Fragment key={fullPath}>
            <ChevronRight size={12} className="text-ink-400" />
            {isLast ? (
              <span className="font-bold text-ink-900">{formatted}</span>
            ) : (
              <button
                onClick={() => onNavigate(fullPath)}
                className="hover:text-forest-800 capitalize font-medium transition-colors"
              >
                {formatted}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
