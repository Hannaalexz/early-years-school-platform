import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Palette,
  ShieldCheck,
  ArrowRight,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';
import { StatCard } from '../../components/common/StatCard.js';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const [markedAll, setMarkedAll] = useState(false);

  // Classroom quick list
  const sampleChildren = [
    { name: 'Emma Johnson', age: '4y 3m', status: 'Present', arrival: '08:45 AM', morningNote: 'Arrived cheerful 🎈', hasAllergy: true },
    { name: 'Lucas Miller', age: '4y 1m', status: 'Present', arrival: '08:50 AM', morningNote: 'Brought extra shoes', hasAllergy: false },
    { name: 'Sara Bekele', age: '3y 11m', status: 'Late', arrival: '09:20 AM', morningNote: 'Heavy rain traffic 🌧️', hasAllergy: false },
    { name: 'Daniel Solomon', age: '4y 4m', status: 'Absent', arrival: '--:--', morningNote: 'Resting at home 🏡', hasAllergy: false },
  ];

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto pb-8">
      {/* Friendly Educator Banner */}
      <div className="bg-gradient-to-r from-[#20BDB2] via-[#2BCBC0] to-[#38D3C7] rounded-3xl p-5 sm:p-6 text-white shadow-sm shadow-[#21B8AF]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2 border border-white/30 backdrop-blur font-['Quicksand']">
            <span>☀️</span>
            <span>Sunshine Classroom • Room A-101 (KG 1)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-['Quicksand'] leading-snug">
            Welcome back, Teacher Helen 🎈
          </h2>
          <p className="text-white/95 text-xs mt-0.5 font-medium font-['Outfit']">
            16 of 18 children present this morning • Ready for sensory exploration and story circles!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMarkedAll(true)}
            className="px-3.5 py-2 rounded-2xl bg-white text-[#0B4E49] text-xs font-bold shadow-xs hover:bg-[#F0FBF9] transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <CheckCircle size={13} className="text-[#21B8AF]" />
            <span>{markedAll ? '✓ Roll Saved' : 'Mark All Present'}</span>
          </button>
          <button
            onClick={() => onNavigate('/development/observations')}
            className="px-3.5 py-2 rounded-2xl bg-[#0B4E49]/30 hover:bg-[#0B4E49]/40 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Sparkles size={13} />
            <span>New Observation</span>
          </button>
          <button
            onClick={() => onNavigate('/development/monthly-progress')}
            className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Award size={13} />
            <span>Monthly Progress</span>
          </button>
        </div>
      </div>

      {/* 4 Friendly Compact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Today's Presence"
          value="16 / 18"
          subtitle="89% in classroom"
          icon={<Users size={19} />}
          colorScheme="sage"
          onClick={() => onNavigate('/attendance')}
        />
        <StatCard
          title="Monthly Progress"
          value="15 / 18"
          subtitle="September term review"
          icon={<Award size={19} />}
          colorScheme="primary"
          onClick={() => onNavigate('/development/monthly-progress')}
        />
        <StatCard
          title="Observations Logged"
          value="4 Logged"
          subtitle="Meaningful growth"
          icon={<Sparkles size={19} />}
          colorScheme="honey"
          onClick={() => onNavigate('/development/observations')}
        />
        <StatCard
          title="Classroom Safety"
          value="0 Incidents"
          subtitle="Safe learning environment"
          icon={<ShieldCheck size={19} />}
          colorScheme="primary"
          onClick={() => onNavigate('/health/incidents')}
        />
      </div>

      {/* Main 2-Column Balanced Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (7 of 12 columns): Quick Roll Call & Play Activities */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="Classroom Roll Call Snapshot"
            subtitle="Today's presence & morning drop-off record"
            action={
              <button
                onClick={() => onNavigate('/attendance')}
                className="text-xs font-bold text-[#0B4E49] hover:underline font-['Quicksand'] flex items-center gap-1"
              >
                <span>Full Roll View</span> <ArrowRight size={12} />
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#F0ECE4] text-ink-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="pb-2.5">Child</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Arrival</th>
                    <th className="pb-2.5">Morning Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F0E8] font-['Outfit']">
                  {sampleChildren.map((c) => (
                    <tr key={c.name} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#3D3530] font-['Quicksand']">{c.name}</span>
                          {c.hasAllergy && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              ⚠️ Allergy
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-ink-400 block">{c.age}</span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-ink-600 font-mono text-[11px]">{c.arrival}</td>
                      <td className="py-2.5 text-ink-700 font-medium text-[11px]">{c.morningNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Today's Activities */}
          <Card
            title="Today's Play-Based Learning"
            subtitle="Sunshine Classroom scheduled discoveries"
            action={
              <button
                onClick={() => onNavigate('/activities')}
                className="text-xs font-bold text-[#0B4E49] hover:underline font-['Quicksand'] flex items-center gap-1"
              >
                <span>+ Log Activity</span>
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-['Outfit']">
              <div className="p-3 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base">🎨</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Done
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#0B4E49] font-['Quicksand']">Color Mixing</h4>
                <p className="text-[10px] text-ink-600">09:30 AM • Fine Motor &amp; Sensory</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base">📖</span>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    Current
                  </span>
                </div>
                <h4 className="font-bold text-xs text-amber-950 font-['Quicksand']">Story Circle</h4>
                <p className="text-[10px] text-ink-600">10:45 AM • Language &amp; Literacy</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base">🌿</span>
                  <span className="text-[9px] font-bold text-ink-500 bg-ivory-200 px-1.5 py-0.5 rounded">
                    Next
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#3D3530] font-['Quicksand']">Outdoor Hunt</h4>
                <p className="text-[10px] text-ink-600">02:00 PM • Counting &amp; Nature</p>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (5 of 12 columns): Monthly Progress & Care Safety */}
        <div className="lg:col-span-5 space-y-4">
          {/* Monthly Progress Card */}
          <Card
            title="Monthly Progress Publishing"
            subtitle="September 2026 Term Progress"
          >
            <div className="space-y-3 font-['Outfit']">
              <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B4E49] font-['Quicksand']">
                    September Parent Reports
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    12 Published
                  </span>
                </div>
                <p className="text-[11px] text-ink-600 leading-relaxed">
                  15 children reviewed across all 6 domains. 3 draft summaries ready for your final touch before sending to families.
                </p>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#C3EFEB]">
                  <div className="h-full bg-[#20BDB2] rounded-full" style={{ width: '83%' }} />
                </div>
              </div>

              <button
                onClick={() => onNavigate('/development/monthly-progress')}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 font-['Quicksand']"
              >
                <span>Review &amp; Publish Monthly Reports</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </Card>

          {/* Classroom Health & Safety Notice */}
          <Card
            title="Classroom Safety & Allergies"
            subtitle="Active protocols for Room A-101"
          >
            <div className="space-y-2 text-xs font-['Outfit']">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold font-['Quicksand']">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span>Emma Johnson: Peanut Allergy Precautions</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Separate snack tray prepared. Wash hands after play dough and before eating.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">
                  Zero injuries or incidents today. Playground safety certified.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
