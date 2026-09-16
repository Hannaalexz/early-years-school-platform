import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Baby,
  Sparkles,
  Award,
  Palette,
  Heart,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Calendar,
  LogOut,
  Sun,
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
    Children: false,
    Development: false,
    Parents: false,
    Settings: false,
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isTeacher = user?.role === 'teacher';

  // Navigation Items according to Section 33 (Admin) and Section 34 (Teacher)
  const teacherNavigation: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={17} />,
    },
    {
      label: 'My Classroom',
      path: '/attendance',
      icon: <Calendar size={17} />,
    },
    {
      label: 'Activities',
      path: '/activities',
      icon: <Palette size={17} />,
    },
    {
      label: 'Observations',
      path: '/development/observations',
      icon: <Sparkles size={17} />,
    },
    {
      label: 'Monthly Progress',
      path: '/development/monthly-progress',
      icon: <Award size={17} />,
      badge: 'Report',
    },
    {
      label: 'Health & Safety',
      path: '/health/incidents',
      icon: <ShieldCheck size={17} />,
    },
    {
      label: 'Announcements',
      path: '/communication/announcements',
      icon: <MessageSquare size={17} />,
    },
  ];

  const adminNavigation: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={17} />,
    },
    {
      label: 'Children',
      path: '/children/all',
      icon: <Baby size={17} />,
      children: [
        { label: 'All Children', path: '/children/all' },
        { label: 'Classrooms', path: '/children/classrooms' },
      ],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <Calendar size={17} />,
    },
    {
      label: 'Development',
      path: '/development/monthly-progress',
      icon: <Sparkles size={17} />,
      children: [
        { label: 'Monthly Progress Reports', path: '/development/monthly-progress' },
        { label: 'Observations', path: '/development/observations' },
      ],
    },
    {
      label: 'Activities',
      path: '/activities',
      icon: <Palette size={17} />,
    },
    {
      label: 'Parents',
      path: '/parents/directory',
      icon: <Heart size={17} />,
      children: [
        { label: 'Parents Directory', path: '/parents/directory' },
        { label: 'Portal Access Codes', path: '/parents/portal-access' },
      ],
    },
    {
      label: 'Staff (Teachers)',
      path: '/staff',
      icon: <Briefcase size={17} />,
    },
    {
      label: 'Health & Safety',
      path: '/health/incidents',
      icon: <ShieldCheck size={17} />,
    },
    {
      label: 'Communication',
      path: '/communication/announcements',
      icon: <MessageSquare size={17} />,
      children: [
        { label: 'Announcements', path: '/communication/announcements' },
        { label: 'Moments Gallery', path: '/communication/gallery' },
      ],
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <BarChart3 size={17} />,
    },
    {
      label: 'Settings',
      path: '/settings/school',
      icon: <Settings size={17} />,
      children: [
        { label: 'School Profile', path: '/settings/school' },
        { label: 'Programs', path: '/settings/programs' },
        { label: 'Classrooms', path: '/settings/classrooms' },
        { label: 'Users & Roles', path: '/settings/users' },
      ],
    },
  ];

  const visibleItems = isTeacher ? teacherNavigation : adminNavigation;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1C2826]/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Locked to viewport with lg:sticky lg:top-0 lg:h-screen to eliminate long empty gaps */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white border-r border-[#EFE9DF] flex flex-col transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0 shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#F0ECE4] bg-gradient-to-r from-[#F0FBF9] via-[#FAFDFD] to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E0F7F4] border border-[#C3EFEB] p-1 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/logo.png"
                alt="Bubbles"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-sm text-[#4B4039] leading-tight font-['Quicksand']">
                {school?.name || 'Bubbles Early Years'}
              </h1>
              <p className="text-[11px] font-semibold text-[#21B8AF] flex items-center gap-1">
                <span>🌱</span> {isTeacher ? 'Teacher Workspace' : 'School Management'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-400 hover:text-ink-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items (Scrollable when needed, neat friendly spacing) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 scrollbar-thin">
          {visibleItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedGroups[item.label];
            const isCurrentActive =
              currentPath === item.path ||
              (hasChildren && item.children?.some((c) => currentPath === c.path));

            return (
              <div key={item.label} className="space-y-0.5">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleGroup(item.label);
                    } else {
                      onNavigate(item.path);
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all duration-150 ${
                    isCurrentActive
                      ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white font-bold shadow-sm shadow-[#21B8AF]/25'
                      : 'text-ink-700 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isCurrentActive ? 'text-white' : 'text-[#21B8AF]'}>
                      {item.icon}
                    </span>
                    <span className="font-['Outfit']">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FEF3C7] text-[#92400E] rounded-md">
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <span className={isCurrentActive ? 'text-white/90' : 'text-ink-400'}>
                        {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      </span>
                    )}
                  </div>
                </button>

                {/* Submenu */}
                {hasChildren && isExpanded && (
                  <div className="pl-8 pr-2 py-1 space-y-0.5 border-l-2 border-[#C3EFEB] ml-4">
                    {item.children!.map((sub) => {
                      const isSubActive = currentPath === sub.path;
                      return (
                        <button
                          key={sub.path}
                          onClick={() => {
                            onNavigate(sub.path);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                            isSubActive
                              ? 'bg-[#E0F7F4] text-[#0B4E49] font-bold border-l-2 border-[#38D3C7]'
                              : 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
                          }`}
                        >
                          <span className="font-['Outfit']">{sub.label}</span>
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

        {/* Friendly Campus Presence Badge */}
        <div className="px-3.5 py-1.5 shrink-0">
          <div className="p-2.5 rounded-2xl bg-[#FFF9F2] border border-[#FFE4CF] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">☀️</span>
              <div>
                <p className="font-bold text-[#8C532B] text-[11px] font-['Quicksand'] leading-tight">
                  Campus In Session
                </p>
                <p className="text-[10px] text-[#A66D46] leading-tight">
                  26 Present • Safe Care Active
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
        </div>

        {/* Parent Portal Fast Access Card */}
        <div className="px-3.5 py-1.5 shrink-0">
          <button
            onClick={() => {
              onNavigate('/portal');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-[#F0FBF9] to-white border border-[#C3EFEB] hover:border-[#38D3C7] hover:shadow-xs transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white flex items-center justify-center text-xs shadow-xs group-hover:scale-105 transition-transform">
                📱
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#0B4E49] font-['Quicksand']">Parent Portal</p>
                <p className="text-[9px] text-[#21B8AF] font-medium">Family View (PIN Access)</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#0B4E49] bg-[#E0F7F4] px-2 py-0.5 rounded-lg">
              Open →
            </span>
          </button>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#F0ECE4] bg-[#FAF8F5] shrink-0">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#EFE9DF] shadow-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#E0F7F4] text-[#0B4E49] font-bold text-xs flex items-center justify-center shrink-0 border border-[#C3EFEB]">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-ink-900 truncate font-['Outfit']">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[10px] text-[#21B8AF] font-medium capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
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
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
