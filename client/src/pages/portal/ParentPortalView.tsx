import React, { useState, useEffect } from 'react';
import {
  Baby,
  Calendar,
  Sparkles,
  ShieldCheck,
  Camera,
  BookOpen,
  ArrowRight,
  LogOut,
  RefreshCw,
  Award,
  AlertCircle,
  Phone,
  CheckCircle2,
  Bell,
  Eye,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';

interface ParentPortalViewProps {
  onBackToApp?: () => void;
  onBackToWebsite?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  onBackToApp,
  onBackToWebsite,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [parent, setParent] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);

  // Login Form state
  const [identifier, setIdentifier] = useState('PAR-7821');
  const [pin, setPin] = useState('1234');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // Portal Data state
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childSummary, setChildSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'activities' | 'pickups'>('home');
  const [showFullReportModal, setShowFullReportModal] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('ey_portal_token');
    const savedParent = localStorage.getItem('ey_portal_parent');
    const savedSchool = localStorage.getItem('ey_portal_school');

    if (savedToken && savedParent) {
      try {
        setParent(JSON.parse(savedParent));
        if (savedSchool) setSchool(JSON.parse(savedSchool));
        setIsAuthenticated(true);
        loadChildren();
      } catch {
        handleLogout();
      }
    }
  }, []);

  const loadChildren = async () => {
    try {
      const res = await api.getPortalChildren();
      if (res.success && res.data && res.data.length > 0) {
        setChildren(res.data);
        setSelectedChildId(res.data[0].id);
        loadSummary(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load children', err);
    }
  };

  const loadSummary = async (childId: string) => {
    setLoadingSummary(true);
    try {
      const res = await api.getPortalChildSummary(childId);
      if (res.success && res.data) {
        setChildSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load child summary', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId);
    loadSummary(childId);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const res = await api.portalLogin(identifier, pin);
      if (res.success && res.data) {
        setParent(res.data.parent);
        setSchool(res.data.school);
        setIsAuthenticated(true);
        loadChildren();
      } else {
        setLoginError(res.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login error');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.portalLogout();
    setIsAuthenticated(false);
    setParent(null);
    setChildren([]);
    setChildSummary(null);
    if (onBackToWebsite) {
      onBackToWebsite();
    }
  };

  // =========================================================================
  // VIEW 1: PORTAL LOGIN SCREEN (Phone/Code + 4-digit PIN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0FBF9] via-white to-[#E8F8F6] flex flex-col justify-center items-center p-4 relative font-sans">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {onBackToWebsite && (
            <button
              onClick={onBackToWebsite}
              className="text-xs font-semibold text-[#0B4E49] hover:text-[#21B8AF] bg-white/90 backdrop-blur px-3.5 py-1.5 rounded-full border border-[#C3EFEB] shadow-sm transition"
            >
              ← School Website
            </button>
          )}
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="text-xs font-semibold text-ink-600 hover:text-ink-900 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-ivory-200 shadow-sm transition"
            >
              Staff Portal
            </button>
          )}
        </div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-[#C3EFEB] shadow-xl shadow-[#21B8AF]/10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Bubbles Early Years School"
              className="h-14 w-auto mx-auto mb-3 object-contain"
            />
            <span className="text-[11px] font-black tracking-wider text-[#0B4E49] uppercase bg-[#E0F7F4] px-3.5 py-1 rounded-full border border-[#C3EFEB]">
              Parent Portal (Ages 1–6)
            </span>
            <h1 className="text-2xl font-extrabold text-[#4B4039] mt-2 font-['Baloo_2']">
              Bubbles Early Years School
            </h1>
            <p className="text-xs text-[#746860] mt-1 font-medium">
              Enter your Family Portal Code &amp; 4-digit PIN
            </p>
          </div>

          {/* Quick Demo Pre-fill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#0B4E49] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#21B8AF]" /> Demo Parent Access
              </span>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('PAR-7821');
                  setPin('1234');
                }}
                className="text-[10px] font-bold text-[#0B4E49] bg-[#E0F7F4] hover:bg-[#C3EFEB] px-2 py-0.5 rounded-md transition"
              >
                1-Click Auto-Fill
              </button>
            </div>
            <p className="text-[11px] text-[#0B4E49] leading-relaxed">
              Family of <strong>Emma Johnson</strong> (Sunshine KG1) &amp; <strong>Noah Johnson</strong> (Toddlers).
            </p>
            <div className="mt-2 flex gap-2 text-[10px] text-[#0B4E49] font-mono">
              <span className="bg-white px-2 py-0.5 rounded border border-[#C3EFEB]">Code: PAR-7821</span>
              <span className="bg-white px-2 py-0.5 rounded border border-[#C3EFEB]">PIN: 1234</span>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-dustyrose-50 border border-dustyrose-200 text-dustyrose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                Portal Code, Phone, or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. PAR-7821 or +251 91 144 5566"
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] bg-ivory-50/50 text-ink-900 font-medium text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] bg-ivory-50/50 text-ink-900 font-mono text-center tracking-widest text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white font-bold text-sm shadow-md shadow-[#21B8AF]/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loggingIn ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying Access...
                </>
              ) : (
                <>
                  Open Parent Portal <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ivory-200 text-center">
            <p className="text-[11px] text-ink-500">
              Need your parent access code or PIN? Contact the school front office.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED PARENT PORTAL (Section 8 & Section 35)
  // =========================================================================
  const currentChild = children.find((c) => c.id === selectedChildId) || children[0];
  const monthlySummary = childSummary?.monthlyAttendanceSummary || { present: 20, absent: 2, late: 1 };
  const monthlyReport = childSummary?.monthlyReport;
  const teacherUpdate = childSummary?.teacherUpdate || {
    teacherName: 'Teacher Helen Brooks',
    date: 'Sep 15, 2026',
    summary: 'Emma has shown wonderful focus and cooperative sharing in classroom learning centers this week. She was very proud of her watercolor mixing artwork!',
  };
  const activities = childSummary?.recentActivities || [];
  const photos = childSummary?.moments || [];
  const announcements = childSummary?.announcements || [];
  const pickups = childSummary?.authorizedPickups || [];

  return (
    <div className="min-h-screen bg-ivory-50 text-ink-900 pb-16 font-sans">
      {/* Top Mobile/Responsive App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-ivory-300 px-4 py-3 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Bubbles" className="h-8 w-auto object-contain" />
            <div>
              <h1 className="text-xs font-bold text-[#4B4039] leading-tight font-['Baloo_2']">
                {school?.name || 'Bubbles Early Years School'}
              </h1>
              <p className="text-[10px] text-[#21B8AF] font-bold">
                Hello, {parent?.first_name} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToWebsite && (
              <button
                onClick={onBackToWebsite}
                className="text-[11px] font-semibold text-[#0B4E49] hover:text-[#21B8AF] bg-[#E0F7F4] border border-[#C3EFEB] px-2.5 py-1.5 rounded-lg transition"
              >
                ← School Website
              </button>
            )}
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="text-[11px] font-semibold text-ink-600 hover:text-ink-900 bg-ivory-100 px-2.5 py-1.5 rounded-lg transition"
              >
                Staff View
              </button>
            )}
            <button
              onClick={handleLogout}
              title="Sign Out of Parent Portal"
              className="p-2 text-ink-400 hover:text-dustyrose-600 hover:bg-dustyrose-50 rounded-xl transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Child Switcher Pills (If family has multiple enrolled children) */}
        {children.length > 1 && (
          <div className="max-w-3xl mx-auto mt-2.5 pt-2 border-t border-ivory-200 flex items-center gap-2 overflow-x-auto pb-0.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500 shrink-0">
              Children:
            </span>
            {children.map((ch) => {
              const isSelected = ch.id === selectedChildId;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChildSelect(ch.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#20BDB2] text-white shadow-xs'
                      : 'bg-ivory-200/80 text-ink-700 hover:bg-ivory-300'
                  }`}
                >
                  <span>{ch.first_name}</span>
                  <span className="text-[10px] opacity-80 font-normal">
                    ({ch.calculated_age?.formatted || ch.gender})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Child Header Card (Section 8 Requirement) */}
        {currentChild && (
          <div className="bg-gradient-to-r from-[#1BA49A] via-[#20BDB2] to-[#38D3C7] rounded-3xl p-5 text-white shadow-lg shadow-[#21B8AF]/20 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 p-1 flex items-center justify-center shrink-0">
                {currentChild.photo_url ? (
                  <img
                    src={currentChild.photo_url}
                    alt={currentChild.first_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-white text-[#0B4E49] font-bold text-xl flex items-center justify-center font-['Baloo_2']">
                    {currentChild.first_name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold font-['Baloo_2'] truncate">
                    {currentChild.first_name} {currentChild.last_name}
                  </h2>
                  <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                    {currentChild.calculated_age?.formatted || 'Early Years'}
                  </span>
                </div>

                <p className="text-xs text-white/90 mt-0.5 font-medium">
                  {currentChild.classroom_name || 'Sunshine Classroom'} • {currentChild.program_name || 'Preschool (KG 1)'}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    At School Today
                  </span>
                  {currentChild.allergies && currentChild.allergies.length > 0 && (
                    <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⚠️ Allergy Alert: {currentChild.allergies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs (Home, Monthly Progress, Activities & Photos, Pickups) */}
        <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-2xl border border-ivory-200 shadow-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
            }`}
          >
            <Baby size={14} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
            }`}
          >
            <Award size={14} />
            <span>Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'activities'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
            }`}
          >
            <Camera size={14} />
            <span>Activities</span>
          </button>

          <button
            onClick={() => setActiveTab('pickups')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pickups'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-[#F0FBF9] hover:text-[#0B4E49]'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Pickups</span>
          </button>
        </div>

        {/* TAB 1: HOME (Section 8 Layout: Attendance summary, Monthly Progress Card, Teacher Update, Activities, Announcements) */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* 1. Monthly Attendance Summary Card */}
            <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
                  <Calendar size={15} className="text-[#21B8AF]" />
                  Monthly Attendance Summary
                </span>
                <span className="text-[10px] text-ink-500 font-bold uppercase tracking-wider">
                  September 2026
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Present</span>
                  <p className="text-xl font-extrabold text-emerald-900 mt-0.5">
                    {monthlySummary.present} Days
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-dustyrose-50 border border-dustyrose-200">
                  <span className="text-[10px] uppercase font-bold text-dustyrose-700">Absent</span>
                  <p className="text-xl font-extrabold text-dustyrose-900 mt-0.5">
                    {monthlySummary.absent} Days
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Late</span>
                  <p className="text-xl font-extrabold text-amber-900 mt-0.5">
                    {monthlySummary.late} Day
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Monthly Progress Card (Link to view the 1–2 page progress report) */}
            <div className="bg-gradient-to-br from-[#F0FBF9] to-white p-5 rounded-3xl border border-[#C3EFEB] shadow-xs relative">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4E49] bg-[#E0F7F4] px-2.5 py-0.5 rounded-full">
                    🌱 Monthly Progress Report
                  </span>
                  <h3 className="text-sm font-extrabold text-ink-900 mt-1">
                    {monthlyReport?.month || 'September 2026'} Growth Milestones
                  </h3>
                  <p className="text-xs text-ink-600 leading-relaxed max-w-md">
                    Comprehensive review across Cognitive, Language, Social-Emotional, Physical, Creative, and Early Literacy domains.
                  </p>
                </div>

                <button
                  onClick={() => setShowFullReportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white text-xs font-bold hover:from-[#1BA49A] hover:to-[#29BCB1] shadow-sm flex items-center gap-1.5 transition shrink-0"
                >
                  <Eye size={14} />
                  <span>View Report →</span>
                </button>
              </div>

              {monthlyReport && (
                <div className="mt-4 pt-3 border-t border-[#C3EFEB] flex items-center justify-between text-[11px] text-ink-600">
                  <span>
                    Status: <strong className="text-emerald-700">✓ Published by Lead Educator</strong>
                  </span>
                  <span>Published on {monthlyReport.publishedAt}</span>
                </div>
              )}
            </div>

            {/* 3. Latest Teacher Update / Summary */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E0F7F4] text-[#0B4E49] text-xs flex items-center justify-center">
                    👩‍🏫
                  </span>
                  Teacher Note • {teacherUpdate.teacherName}
                </span>
                <span className="text-[10px] text-ink-500 font-mono">{teacherUpdate.date}</span>
              </div>
              <p className="text-xs text-ink-800 leading-relaxed italic bg-ivory-50 p-3.5 rounded-2xl border border-ivory-200">
                "{teacherUpdate.summary}"
              </p>
            </div>

            {/* 4. Recent Activities & Photos */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-900 flex items-center gap-2">
                  <Camera size={15} className="text-[#21B8AF]" />
                  Recent Classroom Activities &amp; Photos
                </span>
                <button
                  onClick={() => setActiveTab('activities')}
                  className="text-[11px] font-bold text-[#0B4E49] hover:underline"
                >
                  View all ({activities.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activities.slice(0, 2).map((act: any) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-1.5"
                  >
                    <span className="text-[9px] uppercase font-bold text-[#0B4E49] bg-[#E0F7F4] px-2 py-0.5 rounded">
                      {act.area}
                    </span>
                    <h4 className="text-xs font-bold text-ink-900">{act.title}</h4>
                    <p className="text-[11px] text-ink-600 leading-relaxed line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. School Announcements */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-3">
              <span className="text-xs font-bold text-ink-900 flex items-center gap-2">
                <Bell size={15} className="text-[#21B8AF]" />
                School Announcements
              </span>

              <div className="space-y-2">
                {announcements.map((ann: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex items-start gap-2.5"
                  >
                    <span className="text-base">📢</span>
                    <div>
                      <h4 className="text-xs font-bold text-ink-900">{ann.title}</h4>
                      <p className="text-[11px] text-ink-600 mt-0.5 leading-relaxed">
                        {ann.content}
                      </p>
                      <span className="text-[10px] text-ink-400 font-mono mt-1 block">
                        {ann.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MONTHLY PROGRESS VIEW (1–2 Page Report Card) */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#21B8AF] pb-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-lg font-bold text-ink-900 font-['Baloo_2']">
                      Monthly Development Progress Report
                    </h2>
                    <p className="text-xs text-[#21B8AF] font-bold">
                      {monthlyReport?.month || 'September 2026'}
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  ✓ Published to Parents
                </span>
              </div>

              {/* 6 Domains Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700 mb-3">
                  Developmental Domains Assessment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {monthlyReport?.domains?.map((dom: any) => (
                    <div
                      key={dom.area}
                      className="p-3.5 rounded-2xl border border-ivory-200 bg-ivory-50/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink-900">{dom.area}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            dom.status === 'Achieved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : dom.status === 'Developing'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {dom.status === 'Achieved' ? '✓ ' : '◐ '}
                          {dom.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-600 italic leading-relaxed">
                        "{dom.note}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Summary & Highlights */}
              <div className="space-y-3 pt-3 border-t border-ivory-200">
                <div>
                  <h4 className="text-xs font-bold text-ink-900 mb-1">Teacher Summary</h4>
                  <p className="text-xs text-ink-700 leading-relaxed bg-ivory-50 p-3 rounded-2xl border border-ivory-200">
                    {monthlyReport?.teacherSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-ink-900 mb-1">Classroom Highlights</h4>
                  <p className="text-xs text-ink-700 leading-relaxed bg-[#F0FBF9] p-3 rounded-2xl border border-[#C3EFEB]">
                    🌟 {monthlyReport?.highlights}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITIES & PHOTOS */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-ink-900">Classroom Play &amp; Discovery Activities</h3>
              <div className="space-y-3">
                {activities.map((act: any) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl border border-ivory-200 bg-ivory-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-900">{act.title}</span>
                      <span className="text-[10px] text-ink-500 font-mono">{act.date}</span>
                    </div>
                    <span className="inline-block text-[9px] font-bold text-[#0B4E49] bg-[#E0F7F4] px-2 py-0.5 rounded">
                      🌱 {act.area}
                    </span>
                    <p className="text-xs text-ink-700 leading-relaxed">{act.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-ivory-200">
                <h3 className="text-xs font-bold text-ink-900 mb-3">Moments Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {photos.map((p: any) => (
                    <div key={p.id} className="rounded-2xl overflow-hidden border border-ivory-200 bg-white">
                      <div className="aspect-4/3 relative bg-ivory-100">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-ink-900">{p.title}</p>
                        <p className="text-[11px] text-ink-500 mt-0.5">{p.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUTHORIZED PICKUPS */}
        {activeTab === 'pickups' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-ink-900">Authorized Pickup Register</h3>
                  <p className="text-[11px] text-ink-500">
                    Staff strictly verify identity before releasing {currentChild?.first_name}.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#0B4E49] bg-[#E0F7F4] px-2.5 py-0.5 rounded-full">
                  {pickups.length} Registered
                </span>
              </div>

              <div className="space-y-2.5">
                {pickups.map((p: any) => {
                  const isApproved = p.authorization_status === 'approved';
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-ivory-200 bg-ivory-50/50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-xs">
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-ink-900">{p.name}</p>
                            <span className="text-[10px] font-medium text-ink-500 bg-ivory-100 px-1.5 py-0.5 rounded">
                              {p.relationship}
                            </span>
                          </div>
                          <p className="text-[10px] text-ink-500 font-mono mt-0.5 flex items-center gap-1">
                            <Phone size={10} /> {p.phone}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Authorized (✓)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Full Monthly Report Modal */}
      {showFullReportModal && monthlyReport && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-ivory-300 overflow-hidden my-8">
            <div className="bg-ivory-100 px-6 py-3 border-b border-ivory-200 flex items-center justify-between">
              <span className="text-xs font-bold text-ink-700">
                Official Monthly Progress Report
              </span>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-ink-900">
              <div className="flex items-center justify-between border-b-2 border-[#21B8AF] pb-3">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-base font-bold text-ink-900 font-['Baloo_2']">
                      Bubbles Early Years School
                    </h2>
                    <p className="text-xs text-[#21B8AF] font-bold">
                      Progress Report • {monthlyReport.month}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Published
                </span>
              </div>

              <div className="bg-[#F0FBF9] p-3 rounded-2xl border border-[#C3EFEB] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-500">Child</span>
                  <p className="font-bold text-ink-900">{currentChild?.first_name} {currentChild?.last_name}</p>
                </div>
                <div>
                  <span className="text-ink-500">Monthly Attendance</span>
                  <p className="font-bold text-emerald-800">{monthlySummary.present} Present / {monthlySummary.absent} Absent</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-800 mb-2">
                  Developmental Areas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {monthlyReport.domains?.map((dom: any) => (
                    <div key={dom.area} className="p-3 rounded-xl bg-ivory-50 border border-ivory-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink-900">{dom.area}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {dom.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-600 italic">"{dom.note}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-ivory-200">
                <h4 className="text-xs font-bold text-ink-900">Teacher Summary</h4>
                <p className="text-xs text-ink-700 leading-relaxed bg-ivory-50 p-3 rounded-xl border border-ivory-200">
                  {monthlyReport.teacherSummary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink-900">Classroom Highlights</h4>
                <p className="text-xs text-ink-700 leading-relaxed bg-[#F0FBF9] p-3 rounded-xl border border-[#C3EFEB]">
                  🌟 {monthlyReport.highlights}
                </p>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs text-ink-500">
                <span>Teacher: {monthlyReport.teacherName}</span>
                <span>Bubbles Early Years Platform</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
