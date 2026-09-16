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
  Award
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const [markedAll, setMarkedAll] = useState(false);

  // Classroom quick list
  const sampleChildren = [
    { name: 'Emma Johnson', age: '4y 3m', status: 'Present', arrival: '08:45 AM', droppedOffBy: 'Sarah Johnson (Mother)', departure: 'In class' },
    { name: 'Lucas Miller', age: '4y 1m', status: 'Present', arrival: '08:50 AM', droppedOffBy: 'David Miller (Father)', departure: 'In class' },
    { name: 'Sara Bekele', age: '3y 11m', status: 'Late', arrival: '09:20 AM', droppedOffBy: 'Hanna Bekele (Mother)', departure: 'In class' },
    { name: 'Daniel Solomon', age: '4y 4m', status: 'Absent', arrival: '--:--', droppedOffBy: 'Resting at home', departure: '--:--' },
  ];

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Teacher Action Banner */}
      <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F7F4] text-[#0B4E49] border border-[#C3EFEB] text-xs font-bold mb-2">
            <span>Sunshine Classroom</span>
            <span>•</span>
            <span>Preschool (KG 1)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 font-['Baloo_2']">
            Educator Classroom Hub 👋
          </h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Room A-101 • 18 Children Enrolled • 16 Present • 2 Absent
          </p>
        </div>

        {/* Rapid Classroom Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={markedAll ? 'secondary' : 'primary'}
            size="sm"
            icon={<CheckCircle size={15} />}
            onClick={() => setMarkedAll(true)}
          >
            {markedAll ? '✓ Roll Saved' : 'Mark All Present'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Sparkles size={15} />}
            onClick={() => onNavigate('/development/observations')}
          >
            Observation
          </Button>
          <Button
            variant="terracotta"
            size="sm"
            icon={<Award size={15} />}
            onClick={() => onNavigate('/development/monthly-progress')}
          >
            Monthly Progress
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Palette size={15} />}
            onClick={() => onNavigate('/activities')}
          >
            Activity
          </Button>
        </div>
      </div>

      {/* Classroom Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-ivory-300 shadow-xs">
          <span className="text-xs text-ink-500 font-semibold">Today's Attendance</span>
          <p className="text-2xl font-extrabold text-[#0B4E49] mt-1">16 / 18</p>
          <Badge variant="success" size="sm" className="mt-2">89% Present</Badge>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-ivory-300 shadow-xs">
          <span className="text-xs text-ink-500 font-semibold">Monthly Progress</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">15 / 18</p>
          <Badge variant="success" size="sm" className="mt-2">Sep 2026 Term</Badge>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-ivory-300 shadow-xs">
          <span className="text-xs text-ink-500 font-semibold">Observations Logged</span>
          <p className="text-2xl font-extrabold text-[#21B8AF] mt-1">4 Recorded</p>
          <Badge variant="neutral" size="sm" className="mt-2">Meaningful growth</Badge>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-ivory-300 shadow-xs">
          <span className="text-xs text-ink-500 font-semibold">Class Safety</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">0 Incidents</p>
          <Badge variant="success" size="sm" className="mt-2">Safe Day</Badge>
        </div>
      </div>

      {/* Main Grid: Quick Roster & Today's Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rapid Roster Snapshot */}
        <Card
          title="Classroom Roll Call Snapshot"
          subtitle="Quick attendance and drop-off record"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/attendance')}>
              Full Roll Call →
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ivory-200 text-ink-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Child</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Arrival</th>
                  <th className="pb-3">Handed Over By</th>
                  <th className="pb-3">Pickup Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {sampleChildren.map((c) => (
                  <tr key={c.name} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 font-bold text-ink-900">
                      {c.name}
                      <span className="block text-[10px] text-ink-400 font-normal">{c.age}</span>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={c.status === 'Present' ? 'success' : c.status === 'Late' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-ink-600 font-mono">{c.arrival}</td>
                    <td className="py-3 text-ink-800 font-medium">{c.droppedOffBy}</td>
                    <td className="py-3 text-ink-600">
                      {c.status === 'Present' || c.status === 'Late' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck size={11} className="text-emerald-600" /> Authorized
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Today's Activities Timeline */}
        <Card
          title="Today's Play-Based Activities"
          subtitle="Learning moments for Sunshine Room"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/activities')}>
              + Add
            </Button>
          }
        >
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] text-xs space-y-1">
              <span className="font-bold text-[#0B4E49]">09:30 AM — Finger Painting &amp; Color Mixing</span>
              <p className="text-[11px] text-ink-600">Focus: Fine Motor &amp; Creative Blending</p>
              <Badge variant="success" size="sm" className="mt-1">Completed</Badge>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900">10:45 AM — Story Circle</span>
              <p className="text-[11px] text-ink-600">The Very Hungry Caterpillar • Language &amp; Literacy</p>
              <Badge variant="warning" size="sm" className="mt-1">In Progress</Badge>
            </div>

            <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-xs space-y-1">
              <span className="font-bold text-ink-900">02:00 PM — Outdoor Counting &amp; Leaf Hunt</span>
              <p className="text-[11px] text-ink-600">Focus: Counting objects &amp; Gross Motor Agility</p>
              <Badge variant="neutral" size="sm" className="mt-1">Scheduled</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
