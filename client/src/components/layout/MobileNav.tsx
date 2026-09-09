import React from 'react';
import {
  LayoutDashboard,
  Baby,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Camera,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, onNavigate }) => {
  const { user } = useAuth();

  const getTabs = () => {
    if (user?.role === 'parent') {
      return [
        { label: 'Home', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Children', path: '/children/all', icon: <Baby size={20} /> },
        { label: 'Care', path: '/daily-care/reports', icon: <HeartHandshake size={20} /> },
        { label: 'Moments', path: '/communication/gallery', icon: <Camera size={20} /> },
        { label: 'Messages', path: '/parents/messages', icon: <MessageSquare size={20} /> },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Children', path: '/children/all', icon: <Baby size={20} /> },
        { label: 'Daily Care', path: '/daily-care/meals', icon: <HeartHandshake size={20} /> },
        { label: 'Observations', path: '/development/observations', icon: <Sparkles size={20} /> },
        { label: 'Messages', path: '/parents/messages', icon: <MessageSquare size={20} /> },
      ];
    }

    // Default admin / staff bottom navigation
    return [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Children', path: '/children/all', icon: <Baby size={20} /> },
      { label: 'Parents', path: '/parents/directory', icon: <Baby size={20} /> },
      { label: 'Care', path: '/daily-care/reports', icon: <HeartHandshake size={20} /> },
      { label: 'Settings', path: '/settings/school', icon: <Settings size={20} /> },
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-ivory-300 py-2 px-4 z-40 lg:hidden flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const isActive = currentPath.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => onNavigate(tab.path)}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition-colors ${
              isActive ? 'text-forest-800 font-extrabold' : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            <span className={isActive ? 'text-forest-800 scale-110 transition-transform' : 'text-ink-400'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
