import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useSchool } from '../../context/SchoolContext.js';
import { UserRole } from '../../types/index.js';

interface HeaderProps {
  onMenuToggle: () => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onNavigate }) => {
  const { user, switchDemoRole, demoAccounts } = useAuth();
  const { school, currentAcademicYear } = useSchool();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Emma arrived safely', time: '08:55 AM', type: 'arrival' },
    { id: 2, title: 'Daily Report published for Sunshine Classroom', time: '01:30 PM', type: 'report' },
    { id: 3, title: 'New admission tour scheduled for Thursday', time: '11:15 AM', type: 'admissions' },
  ];

  return (
    <header className="h-16 bg-white border-b border-ivory-300 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-ink-600 hover:bg-ivory-200 lg:hidden focus:outline-none"
        >
          <Menu size={20} />
        </button>

        {/* School & Campus Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-100 border border-primary-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="font-bold text-primary-900">{school?.name || 'Bubbles Early Years School'}</span>
          <span className="text-ink-400">/</span>
          <span className="text-primary-800 font-semibold">Bole Main Campus</span>
        </div>

        {/* Current Academic Year */}
        {currentAcademicYear && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ivory-100 text-ink-600 text-xs border border-ivory-300">
            <Calendar size={13} className="text-primary-700" />
            <span className="font-medium">{currentAcademicYear.name}</span>
          </div>
        )}
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* School Website public link */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('/website')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-900 text-xs font-bold border border-primary-200 transition-colors shadow-xs"
            title="View Public School Website"
          >
            <span>School Website</span>
            <span className="text-xs">🌐</span>
          </button>
        )}

        {/* Quick 1-Click Role Switcher Pill (Crucial for Reviewer Testing) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 hover:from-primary-800 hover:to-primary-600 text-white text-xs font-bold shadow-sm shadow-primary-500/25 transition-all"
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Role:</span>
            <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
            <ChevronDown size={14} />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-ivory-300 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-ivory-200">
                <p className="text-[11px] font-bold text-ink-900">Switch Demo Account (Phase 1)</p>
                <p className="text-[10px] text-ink-500">Instantly test access across roles</p>
              </div>
              <div className="py-1 space-y-1">
                {demoAccounts.map((acc) => {
                  const isCurrent = user?.role === acc.role_id;
                  return (
                    <button
                      key={acc.role_id}
                      onClick={() => {
                        switchDemoRole(acc.role_id);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        isCurrent
                          ? 'bg-primary-100 text-primary-900 font-bold'
                          : 'text-ink-700 hover:bg-ivory-200'
                      }`}
                    >
                      <div>
                        <p className="font-bold capitalize">{acc.role_name}</p>
                        <p className="text-[10px] text-ink-500">{acc.first_name} {acc.last_name}</p>
                      </div>
                      {isCurrent && <CheckCircle2 size={14} className="text-primary-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-ink-600 hover:bg-ivory-200 relative transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-ivory-300 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
                <span className="text-xs font-bold text-ink-900">Notifications</span>
                <span className="text-[10px] text-primary-800 font-bold">3 unread</span>
              </div>
              <div className="py-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
                    <p className="font-semibold text-ink-800">{n.title}</p>
                    <p className="text-[10px] text-ink-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-ivory-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-800 to-primary-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};
