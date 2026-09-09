import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Baby,
  Sparkles,
  HeartHandshake,
  Palette,
  Heart,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useSchool } from '../../context/SchoolContext.js';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string;
  children?: { label: string; path: string; badge?: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { school } = useSchool();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Children: true,
    'Daily Care': false,
    Settings: false,
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Simplified Early Years Navigation (Section 37) - Transport & Finance omitted
  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Children',
      path: '/children/all',
      icon: <Baby size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher', 'admissions'],
      children: [
        { label: 'All Children', path: '/children/all' },
        { label: 'Classrooms', path: '/children/classrooms' },
      ],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <Calendar size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Attendance Roll', path: '/attendance' },
        { label: 'Attendance History', path: '/attendance/history' },
      ],
    },
    {
      label: 'Development',
      path: '/development',
      icon: <Sparkles size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Observations', path: '/development/observations' },
        { label: 'Assessments', path: '/development/assessments' },
        { label: 'Milestones', path: '/development/milestones' },
        { label: 'Child Portfolios', path: '/development/portfolios' },
      ],
    },
    {
      label: 'Daily Care',
      path: '/daily-care',
      icon: <HeartHandshake size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Daily Care Logger', path: '/daily-care/logger' },
        { label: 'Meals', path: '/daily-care/meals' },
        { label: 'Nap Tracking', path: '/daily-care/naps' },
        { label: 'Mood & Wellbeing', path: '/daily-care/mood' },
        { label: 'Daily Reports', path: '/daily-care/reports' },
      ],
    },
    {
      label: 'Activities',
      path: '/activities',
      icon: <Palette size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Activities', path: '/activities/list' },
        { label: 'Lesson Plans', path: '/activities/lesson-plans' },
        { label: 'Events', path: '/activities/events' },
      ],
    },
    {
      label: 'Parents',
      path: '/parents/directory',
      icon: <Heart size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Parents Directory', path: '/parents/directory' },
        { label: 'Portal Access Codes', path: '/parents/portal-access' },
      ],
    },
    {
      label: 'Staff',
      path: '/staff',
      icon: <Briefcase size={18} />,
      roles: ['super_admin', 'school_admin'],
      children: [
        { label: 'Teachers', path: '/staff/teachers' },
        { label: 'Class Assignments', path: '/staff/assignments' },
      ],
    },
    {
      label: 'Health & Safety',
      path: '/health',
      icon: <ShieldCheck size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Health & Allergies', path: '/health/records' },
        { label: 'Incidents & First Aid', path: '/health/incidents' },
      ],
    },
    {
      label: 'Communication',
      path: '/communication',
      icon: <MessageSquare size={18} />,
      roles: ['super_admin', 'school_admin', 'teacher'],
      children: [
        { label: 'Announcements', path: '/communication/announcements' },
        { label: 'Moments Gallery', path: '/communication/gallery' },
      ],
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <BarChart3 size={18} />,
      roles: ['super_admin', 'school_admin'],
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings size={18} />,
      roles: ['super_admin', 'school_admin'],
      children: [
        { label: 'School Profile', path: '/settings/school' },
        { label: 'Programs', path: '/settings/programs' },
        { label: 'Classrooms', path: '/settings/classrooms' },
        { label: 'Users & Roles', path: '/settings/users' },
      ],
    },
  ];

  // Filter items by user role
  const visibleItems = navigationItems.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return item.roles.includes(user.role);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-ivory-300 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-ivory-200 bg-gradient-to-r from-[#F0FBF9] to-white">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Bubbles"
              className="h-9 w-auto object-contain"
            />
            <div>
              <h1 className="font-extrabold text-sm text-[#4B4039] leading-tight font-['Baloo_2']">
                {school?.name || 'Bubbles Early Years'}
              </h1>
              <p className="text-[11px] font-bold text-[#21B8AF]">Early Years Platform (1–6)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-400 hover:text-ink-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {visibleItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedGroups[item.label];
            const isCurrentActive =
              currentPath === item.path ||
              (hasChildren && item.children?.some((c) => currentPath === c.path));

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleGroup(item.label);
                    } else {
                      onNavigate(item.path);
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isCurrentActive
                      ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white font-bold shadow-md shadow-[#21B8AF]/25'
                      : 'text-ink-700 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isCurrentActive ? 'text-white' : 'text-[#21B8AF]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {hasChildren && (
                    <span className={isCurrentActive ? 'text-white/90' : 'text-ink-400'}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </button>

                {/* Submenu */}
                {hasChildren && isExpanded && (
                  <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#C3EFEB] ml-4">
                    {item.children!.map((sub) => {
                      const isSubActive = currentPath === sub.path;
                      return (
                        <button
                          key={sub.path}
                          onClick={() => {
                            onNavigate(sub.path);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                            isSubActive
                              ? 'bg-[#E0F7F4] text-[#0B4E49] font-bold border-l-2 border-[#38D3C7]'
                              : 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
                          }`}
                        >
                          <span>{sub.label}</span>
                          {sub.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-terracotta-100 text-terracotta-600 rounded">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Parent Portal Fast Access Card */}
        <div className="px-3 py-2">
          <button
            onClick={() => {
              onNavigate('/portal');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#F0FBF9] to-white border border-[#C3EFEB] hover:border-[#38D3C7] hover:shadow-sm transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                📱
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#0B4E49]">Parent Portal</p>
                <p className="text-[9px] text-[#21B8AF] font-medium">Dedicated Mobile View</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#0B4E49] bg-[#E0F7F4] px-2 py-0.5 rounded-md">
              Launch →
            </span>
          </button>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-ivory-200 bg-ivory-50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-ivory-300">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-sage-200 text-forest-800 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-ink-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[10px] text-ink-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                onNavigate('/website');
              }}
              title="Log out and return to School Website"
              className="p-1.5 text-ink-400 hover:text-dustyrose-600 rounded-lg hover:bg-dustyrose-50 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
