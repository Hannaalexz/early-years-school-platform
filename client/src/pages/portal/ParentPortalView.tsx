import React, { useState, useEffect } from 'react';
import {
  Baby,
  Heart,
  Clock,
  Utensils,
  Moon,
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
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Calendar
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
  const [activeTab, setActiveTab] = useState<'today' | 'milestones' | 'moments' | 'pickups'>('today');

  // Check saved session on load
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

  // Fetch children
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

  // Fetch summary when selected child changes
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
  // VIEW 1: PORTAL LOGIN MODAL / SCREEN (Code + 4-digit PIN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-sage-50 flex flex-col justify-center items-center p-4 relative">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {onBackToWebsite && (
            <button
              onClick={onBackToWebsite}
              className="text-xs font-semibold text-forest-800 hover:text-forest-900 bg-white/90 backdrop-blur px-3.5 py-1.5 rounded-full border border-ivory-300 shadow-sm transition"
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

        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-amber-200/80 shadow-xl shadow-amber-900/5">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Bubbles Early Years School"
              className="h-14 w-auto mx-auto mb-3 object-contain"
            />
            <span className="text-[11px] font-black tracking-wider text-[#168F89] uppercase bg-[#BDF3EE] px-3.5 py-1 rounded-full">
              Dedicated Parent Portal
            </span>
            <h1 className="text-2xl font-extrabold text-[#4B4039] mt-2 font-['Baloo_2']">
              Bubbles Early Years School
            </h1>
            <p className="text-xs text-[#746860] mt-1 font-medium">
              Enter your Family Portal Code or Phone &amp; 4-digit PIN
            </p>
          </div>

          {/* Quick Demo Pre-fill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-600" /> Demo Parent Access
              </span>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('PAR-7821');
                  setPin('1234');
                }}
                className="text-[10px] font-bold text-amber-700 bg-amber-200/60 hover:bg-amber-200 px-2 py-0.5 rounded-md transition"
              >
                1-Click Auto-Fill
              </button>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Family of <strong>Emma Johnson</strong> (Sunshine KG1) &amp; <strong>Noah Johnson</strong> (Toddlers).
            </p>
            <div className="mt-2 flex gap-2 text-[10px] text-amber-900 font-mono">
              <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">Code: PAR-7821</span>
              <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">PIN: 1234</span>
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
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-ivory-50/50 text-ink-900 font-medium text-sm"
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
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-ivory-50/50 text-ink-900 font-mono text-center tracking-widest text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
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
  // VIEW 2: AUTHENTICATED PARENT PORTAL
  // =========================================================================
  const currentChild = children.find((c) => c.id === selectedChildId) || children[0];
  const live = childSummary?.todayLive;
  const milestones = childSummary?.milestones || [];
  const moments = childSummary?.moments || [];
  const pickups = childSummary?.authorizedPickups || [];

  return (
    <div className="min-h-screen bg-ivory-50 text-ink-900 pb-16">
      {/* Top Mobile/Responsive App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-ivory-300 px-4 py-3 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Bubbles"
              className="h-8 w-auto object-contain"
            />
            <div>
              <h1 className="text-xs font-bold text-[#4B4039] leading-tight font-['Baloo_2']">
                {school?.name || 'Bubbles Early Years School'}
              </h1>
              <p className="text-[10px] text-[#168F89] font-bold">
                Hello, {parent?.first_name} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToWebsite && (
              <button
                onClick={onBackToWebsite}
                className="text-[11px] font-semibold text-forest-800 hover:text-forest-900 bg-sage-50 border border-sage-200 px-2.5 py-1.5 rounded-lg transition"
              >
                ← School Website
              </button>
            )}
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="text-[11px] font-semibold text-ink-600 hover:text-forest-800 bg-ivory-100 px-2.5 py-1.5 rounded-lg transition"
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

        {/* Child Switcher Pills (If multiple children) */}
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
                      ? 'bg-amber-500 text-white shadow-xs'
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
        {/* Child Hero Banner Card */}
        {currentChild && (
          <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-500 rounded-3xl p-5 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 p-1 flex items-center justify-center shrink-0">
                {currentChild.photo_url ? (
                  <img
                    src={currentChild.photo_url}
                    alt={currentChild.first_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-white text-primary-800 font-bold text-xl flex items-center justify-center">
                    {currentChild.first_name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold font-display truncate">
                    {currentChild.first_name} {currentChild.last_name}
                  </h2>
                  <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                    {currentChild.calculated_age?.formatted || 'Early Years'}
                  </span>
                </div>

                <p className="text-xs text-primary-50 mt-0.5 font-medium">
                  {currentChild.classroom_name || 'Sunshine Classroom'} • {currentChild.program_name || 'Preschool'}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Present Today (In Class)
                  </span>
                  {currentChild.allergies && currentChild.allergies.length > 0 && (
                    <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⚠️ Allergy: {currentChild.allergies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-2xl border border-ivory-200 shadow-xs">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-xs'
                : 'text-ink-600 hover:bg-primary-50 hover:text-primary-900'
            }`}
          >
            <Clock size={14} />
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'milestones'
                ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-xs'
                : 'text-ink-600 hover:bg-primary-50 hover:text-primary-900'
            }`}
          >
            <Award size={14} />
            <span>Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('moments')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'moments'
                ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-xs'
                : 'text-ink-600 hover:bg-primary-50 hover:text-primary-900'
            }`}
          >
            <Camera size={14} />
            <span>Moments</span>
          </button>

          <button
            onClick={() => setActiveTab('pickups')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pickups'
                ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-xs'
                : 'text-ink-600 hover:bg-primary-50 hover:text-primary-900'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Pickups</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        {loadingSummary ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-ivory-200 shadow-xs">
            <RefreshCw size={24} className="animate-spin text-amber-500 mx-auto mb-2" />
            <p className="text-xs text-ink-500 font-medium">Fetching today's classroom report...</p>
          </div>
        ) : (
          <>
            {/* ============================================================= */}
            {/* TAB 1: TODAY'S LIVE CARE & LEARNING FEED                      */}
            {/* ============================================================= */}
            {activeTab === 'today' && live && (
              <div className="space-y-3.5">
                {/* 4-Grid Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Mood Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-ivory-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                      <span className="font-semibold">Mood</span>
                      <span>😊</span>
                    </div>
                    <p className="text-sm font-bold text-ink-900">{live.mood.status}</p>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Engaged &amp; cheerful</p>
                  </div>

                  {/* Nap Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-ivory-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                      <span className="font-semibold">Nap Rest</span>
                      <Moon size={14} className="text-indigo-500" />
                    </div>
                    <p className="text-sm font-bold text-ink-900">{live.nap.duration}</p>
                    <p className="text-[10px] text-ink-500 font-medium mt-0.5">{live.nap.status}</p>
                  </div>

                  {/* Lunch Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-ivory-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                      <span className="font-semibold">Lunch</span>
                      <Utensils size={14} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-bold text-ink-900">Ate 80%</p>
                    <p className="text-[10px] text-amber-700 font-medium mt-0.5">Rice &amp; Veggie Stew</p>
                  </div>

                  {/* Potty Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-ivory-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                      <span className="font-semibold">Potty</span>
                      <Sparkles size={14} className="text-teal-500" />
                    </div>
                    <p className="text-sm font-bold text-ink-900">3x Success</p>
                    <p className="text-[10px] text-teal-700 font-medium mt-0.5">Dry &amp; Comfortable</p>
                  </div>
                </div>

                {/* Teacher's Personal Daily Note */}
                {live.teacherNote && (
                  <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                          👩‍🏫
                        </div>
                        <span className="text-xs font-bold text-amber-950">
                          {live.teacherNote.teacherName}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-mono">
                        {live.teacherNote.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-amber-200/40">
                      "{live.teacherNote.message}"
                    </p>
                  </div>
                )}

                {/* Meals Detail Card */}
                <div className="bg-white p-4 rounded-2xl border border-ivory-200 shadow-xs">
                  <h3 className="text-xs font-bold text-ink-900 flex items-center gap-2 mb-3">
                    <Utensils size={15} className="text-amber-600" />
                    Today's Meals &amp; Nutrition
                  </h3>
                  <div className="space-y-2.5">
                    {live.meals.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-ivory-50 border border-ivory-200"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink-900">{m.meal}</span>
                            <span className="text-[10px] font-mono text-ink-500">{m.time}</span>
                          </div>
                          <p className="text-[11px] text-ink-600 mt-0.5">{m.items}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {m.intake}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Learning & Curriculum Activities */}
                <div className="bg-white p-4 rounded-2xl border border-ivory-200 shadow-xs">
                  <h3 className="text-xs font-bold text-ink-900 flex items-center gap-2 mb-3">
                    <BookOpen size={15} className="text-forest-700" />
                    Early Years Curriculum Activities
                  </h3>
                  <div className="space-y-3">
                    {live.activities.map((act: any, idx: number) => (
                      <div key={idx} className="relative pl-5 pb-2 border-l-2 border-sage-300 last:pb-0">
                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-forest-600 border-2 border-white shadow-xs" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink-900">{act.title}</span>
                          <span className="text-[10px] font-mono text-ink-500">{act.time}</span>
                        </div>
                        <span className="inline-block mt-0.5 text-[9px] font-bold tracking-wide uppercase text-sage-800 bg-sage-100 px-2 py-0.5 rounded">
                          {act.domain}
                        </span>
                        <p className="text-[11px] text-ink-600 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 2: DEVELOPMENT MILESTONES                                 */}
            {/* ============================================================= */}
            {activeTab === 'milestones' && (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-ivory-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-ink-900">
                        EYFS Developmental Progress
                      </h3>
                      <p className="text-[11px] text-ink-500">
                        Continuous teacher observations based on age milestones
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {milestones.filter((m: any) => m.status === 'Mastered' || m.status === 'Achieved').length} / {milestones.length} Achieved
                    </span>
                  </div>

                  <div className="space-y-2">
                    {milestones.map((m: any) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl border border-ivory-200 bg-ivory-50/60 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-forest-800 bg-sage-100 px-2 py-0.5 rounded">
                            {m.domain}
                          </span>
                          <p className="text-xs font-bold text-ink-900">{m.title}</p>
                          <p className="text-[10px] text-ink-500">
                            Observed by {m.teacher} on {m.observationDate}
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                            m.status === 'Mastered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'Achieved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 3: MOMENTS GALLERY                                        */}
            {/* ============================================================= */}
            {activeTab === 'moments' && (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-ivory-200 shadow-xs">
                  <h3 className="text-xs font-bold text-ink-900 mb-1">
                    Classroom Moments &amp; Photos
                  </h3>
                  <p className="text-[11px] text-ink-500 mb-4">
                    Photos uploaded safely by teachers for your family eyes only
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {moments.map((pic: any) => (
                      <div
                        key={pic.id}
                        className="rounded-2xl overflow-hidden border border-ivory-200 bg-white shadow-xs group"
                      >
                        <div className="aspect-4/3 relative overflow-hidden bg-ivory-100">
                          <img
                            src={pic.imageUrl}
                            alt={pic.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[9px] font-mono px-2 py-0.5 rounded">
                            {pic.time}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold text-ink-900">{pic.title}</p>
                          <p className="text-[11px] text-ink-600 mt-0.5">{pic.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 4: AUTHORIZED PICKUPS & SECURITY                          */}
            {/* ============================================================= */}
            {activeTab === 'pickups' && (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-ivory-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-ink-900">
                        Authorized Pickup List
                      </h3>
                      <p className="text-[11px] text-ink-500">
                        Staff verify ID card or security PIN before releasing {currentChild?.first_name}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-sage-800 bg-sage-100 px-2 py-0.5 rounded-full">
                      {pickups.length} Contacts
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {pickups.map((p: any) => {
                      const isApproved = p.authorization_status === 'approved';
                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                            isApproved
                              ? 'bg-white border-ivory-200'
                              : 'bg-dustyrose-50/50 border-dustyrose-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-sage-100 text-forest-800 font-bold flex items-center justify-center text-xs shrink-0">
                              {p.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-ink-900">{p.name}</p>
                                <span className="text-[9px] font-medium text-ink-500 bg-ivory-100 px-1.5 py-0.5 rounded">
                                  {p.relationship}
                                </span>
                              </div>
                              <p className="text-[10px] text-ink-500 font-mono mt-0.5 flex items-center gap-1">
                                <Phone size={10} /> {p.phone}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-dustyrose-100 text-dustyrose-800'
                              }`}
                            >
                              {isApproved ? 'Approved' : 'Revoked'}
                            </span>
                            {p.security_pin && isApproved && (
                              <p className="text-[9px] text-ink-500 font-mono mt-1">
                                PIN: ••••
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
