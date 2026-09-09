import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  Utensils,
  Moon,
  Sparkles,
  BookOpen,
  Camera,
  MessageSquare,
  AlertTriangle,
  Plus
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
    { name: 'Emma Johnson', age: '4y 3m', status: 'Present', arrival: '08:55 AM', mood: 'Happy 😊', meal: 'Ate all' },
    { name: 'Noah Tadesse', age: '4y 1m', status: 'Present', arrival: '09:02 AM', mood: 'Calm 😌', meal: 'Ate most' },
    { name: 'Sara Bekele', age: '3y 11m', status: 'Late', arrival: '09:20 AM', mood: 'Active 🏃', meal: 'Pending' },
    { name: 'Daniel Solomon', age: '4y 4m', status: 'Absent', arrival: 'Sick notice', mood: '-', meal: '-' },
  ];

  return (
    <div className="space-y-6">
      {/* Teacher Action Banner */}
      <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-900 border border-primary-200 text-xs font-bold mb-2">
            <span>Sunshine Classroom</span>
            <span>•</span>
            <span>Preschool (KG 1)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900">
            Bethany's Educator Hub 👋
          </h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Room A-101 • 18 Enrolled • 16 Present • 2 Absent
          </p>
        </div>

        {/* Rapid Classroom Action Buttons (#49: Minimizing clicks) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={markedAll ? 'secondary' : 'primary'}
            size="sm"
            icon={<CheckCircle size={15} />}
            onClick={() => setMarkedAll(true)}
          >
            {markedAll ? '✓ Attendance Saved' : 'Mark All Present'}
          </Button>
          <Button
            variant="terracotta"
            size="sm"
            icon={<Utensils size={15} />}
            onClick={() => onNavigate('/daily-care/meals')}
          >
            Record Care
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
            variant="secondary"
            size="sm"
            icon={<BookOpen size={15} />}
            onClick={() => onNavigate('/daily-care/reports')}
          >
            Daily Report
          </Button>
        </div>
      </div>

      {/* Classroom Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Attendance</span>
          <p className="text-2xl font-extrabold text-primary-800 mt-1">16 / 18</p>
          <Badge variant="success" size="sm" className="mt-2">89% Present</Badge>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Breakfast / Snack</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">16 / 16</p>
          <Badge variant="success" size="sm" className="mt-2">Completed</Badge>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Daily Reports</span>
          <p className="text-2xl font-extrabold text-terracotta-600 mt-1">14 / 16</p>
          <Badge variant="warning" size="sm" className="mt-2">2 Drafts Left</Badge>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Observations</span>
          <p className="text-2xl font-extrabold text-primary-800 mt-1">4 Logged</p>
          <Badge variant="neutral" size="sm" className="mt-2">This Week</Badge>
        </div>
      </div>

      {/* Main Grid: Quick Roster & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rapid Roster Snapshot */}
        <Card
          title="Classroom Roll Snapshot"
          subtitle="Quick check-in & care overview for Sunshine Classroom"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/children/attendance')}>
              Full Attendance View
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
                  <th className="pb-3">Mood</th>
                  <th className="pb-3">Meal</th>
                  <th className="pb-3 text-right">Quick Care</th>
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
                    <td className="py-3 text-ink-600">{c.arrival}</td>
                    <td className="py-3 text-ink-800 font-medium">{c.mood}</td>
                    <td className="py-3 text-ink-600">{c.meal}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('/daily-care/meals')}
                      >
                        + Care
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Today's Activities Timeline */}
        <Card
          title="Today's Lesson & Routine"
          subtitle="Schedule for KG 1"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/activities/list')}>
              + Plan
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-200 text-xs">
              <span className="font-bold text-primary-900">09:30 AM — Finger Painting</span>
              <p className="text-[11px] text-ink-600 mt-0.5">Focus: Fine Motor & Color Blending</p>
              <Badge variant="success" size="sm" className="mt-2">Completed</Badge>
            </div>

            <div className="p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs">
              <span className="font-bold text-terracotta-700">10:45 AM — Story Time</span>
              <p className="text-[11px] text-ink-600 mt-0.5">The Very Hungry Caterpillar • Language & Early Literacy</p>
              <Badge variant="warning" size="sm" className="mt-2">In Progress</Badge>
            </div>

            <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
              <span className="font-bold text-ink-900">02:00 PM — Outdoor Scavenger Hunt</span>
              <p className="text-[11px] text-ink-600 mt-0.5">Focus: Counting objects & Gross Motor Balance</p>
              <Badge variant="neutral" size="sm" className="mt-2">Scheduled</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
