import React, { useEffect, useState } from 'react';
import {
  Baby,
  UserCheck,
  UserX,
  Clock,
  GraduationCap,
  DoorOpen,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Bell,
  Sparkles,
  Plus,
  ArrowRight
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { api } from '../../services/api.js';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = stats?.kpis || {
    totalChildren: 28,
    presentToday: 26,
    absentToday: 2,
    lateToday: 1,
    totalTeachers: 6,
    totalClassrooms: 4,
    activeAllergies: 3,
    recentIncidents: 0,
  };

  const attendance = stats?.todayAttendance || {
    present: 26,
    absent: 2,
    late: 1,
    rate: '92.8%',
    arrivedOnTime: 25,
    droppedOffRecorded: 26,
    pickupDeparturesRecorded: 0,
  };

  const classrooms = stats?.classroomCapacities || [
    { name: 'Sunshine Classroom (KG1)', enrolled: 18, capacity: 18, fill: 100 },
    { name: 'Rainbow Classroom (Nursery)', enrolled: 14, capacity: 16, fill: 87.5 },
    { name: 'Butterfly Room (Toddlers)', enrolled: 10, capacity: 12, fill: 83.3 },
    { name: 'Little Explorers (KG2)', enrolled: 16, capacity: 20, fill: 80 },
  ];

  const upcomingEvents = stats?.upcomingEvents || [
    { date: 'Sep 22, 2026', title: 'Autumn Leaf Sensory Exploration', time: '10:00 AM' },
    { date: 'Sep 29, 2026', title: 'Parent-Teacher Monthly Growth Circle', time: '04:00 PM' },
  ];

  const announcements = stats?.recentAnnouncements || [
    { title: 'Welcome to September Learning Term', date: 'Sep 15, 2026', author: 'School Admin' },
    { title: 'Reminder: Update Authorized Pickup Lists', date: 'Sep 10, 2026', author: 'Front Desk' },
  ];

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1BA49A] via-[#20BDB2] to-[#38D3C7] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-[#21B8AF]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 border border-white/30 backdrop-blur">
            <ShieldCheck size={14} />
            <span>School Administration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Baloo_2']">
            Good morning, Martha 👋
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl font-medium">
            Bubbles Early Years School is in session. {kpis.totalChildren} enrolled children across {kpis.totalClassrooms} classrooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('/attendance')}
            className="px-4 py-2 rounded-xl bg-white text-[#0B4E49] text-xs font-bold shadow-sm hover:bg-[#F0FBF9] transition"
          >
            Open Attendance Roll
          </button>
          <button
            onClick={() => onNavigate('/development/monthly-progress')}
            className="px-4 py-2 rounded-xl bg-[#0B4E49]/30 hover:bg-[#0B4E49]/50 text-white text-xs font-bold border border-white/30 transition"
          >
            Monthly Reports
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Section 25: Total children, Present today, Absent today, Late today, Teachers, Classrooms) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          title="Total Children"
          value={String(kpis.totalChildren)}
          subtitle="Ages 1–6"
          icon={<Baby size={20} />}
          colorScheme="primary"
          onClick={() => onNavigate('/children/all')}
        />
        <StatCard
          title="Present Today"
          value={String(kpis.presentToday)}
          subtitle={`${attendance.rate} attendance`}
          icon={<UserCheck size={20} />}
          colorScheme="primary"
          trend={{ value: attendance.rate, isPositive: true }}
          onClick={() => onNavigate('/attendance')}
        />
        <StatCard
          title="Absent Today"
          value={String(kpis.absentToday)}
          subtitle="Reported resting"
          icon={<UserX size={20} />}
          colorScheme="dustyrose"
          onClick={() => onNavigate('/attendance')}
        />
        <StatCard
          title="Late Today"
          value={String(kpis.lateToday)}
          subtitle="Traffic delays"
          icon={<Clock size={20} />}
          colorScheme="amber"
          onClick={() => onNavigate('/attendance')}
        />
        <StatCard
          title="Teachers & Staff"
          value={String(kpis.totalTeachers)}
          subtitle="Educators on duty"
          icon={<GraduationCap size={20} />}
          colorScheme="primary"
          onClick={() => onNavigate('/staff')}
        />
        <StatCard
          title="Classrooms"
          value={String(kpis.totalClassrooms)}
          subtitle="All rooms active"
          icon={<DoorOpen size={20} />}
          colorScheme="primary"
          onClick={() => onNavigate('/children/classrooms')}
        />
      </div>

      {/* Middle Section: Classroom Capacities & Today's Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classrooms */}
        <Card
          title="Classroom Capacities & Distribution"
          subtitle="Early childhood placement"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('/children/all')}
            >
              View All Children
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-3.5">
            {classrooms.map((c: any) => (
              <div key={c.name} className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-ink-900">{c.name}</span>
                  <span className="font-semibold text-ink-600">
                    {c.enrolled} / {c.capacity} Children ({c.fill}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-ivory-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] transition-all duration-500"
                    style={{ width: `${Math.max(c.fill, 15)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Attendance Breakdown (Section 25) */}
        <Card
          title="Today's Attendance Breakdown"
          subtitle="Morning roll and pickup tracking"
          className="space-y-3"
        >
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex items-center justify-between text-xs">
              <span className="font-bold text-[#0B4E49]">Morning Drop-offs Logged</span>
              <span className="font-extrabold text-[#0B4E49] text-sm">
                {attendance.droppedOffRecorded} Children
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-800">On-Time Arrivals</span>
              <span className="font-bold text-emerald-800">{attendance.arrivedOnTime}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-800">Late Arrivals</span>
              <span className="font-bold text-amber-800">{attendance.late}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-800">Departures / Pickups Recorded</span>
              <span className="font-bold text-ink-600">{attendance.pickupDeparturesRecorded}</span>
            </div>

            <button
              onClick={() => onNavigate('/attendance')}
              className="w-full py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-[#0B4E49] text-xs font-bold transition text-center"
            >
              Manage Attendance Roll →
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Recent Incidents, Upcoming Events, Announcements (Section 25) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <Card
          title="Safety & Incidents"
          subtitle="Campus first aid log"
          action={
            <button
              onClick={() => onNavigate('/health/incidents')}
              className="text-[11px] font-bold text-[#0B4E49] hover:underline"
            >
              View Log
            </button>
          }
        >
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#21B8AF] shrink-0" />
              <span className="text-[#0B4E49] font-medium">
                Zero active medical incidents today. Playground supervised.
              </span>
            </div>
            <p className="text-[11px] text-ink-500 italic pt-1">
              All staff certified in pediatric first aid and CPR.
            </p>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card
          title="Upcoming School Events"
          subtitle="Campus calendar"
        >
          <div className="space-y-2 text-xs">
            {upcomingEvents.map((evt: any, i: number) => (
              <div key={i} className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-0.5">
                <p className="font-bold text-ink-900">{evt.title}</p>
                <div className="flex items-center justify-between text-[11px] text-ink-500">
                  <span>{evt.date}</span>
                  <span className="font-mono">{evt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card
          title="Recent Announcements"
          subtitle="Parent and school broadcasts"
          action={
            <button
              onClick={() => onNavigate('/communication/announcements')}
              className="text-[11px] font-bold text-[#0B4E49] hover:underline"
            >
              Manage
            </button>
          }
        >
          <div className="space-y-2 text-xs">
            {announcements.map((ann: any, i: number) => (
              <div key={i} className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-0.5">
                <p className="font-bold text-ink-900">{ann.title}</p>
                <div className="flex items-center justify-between text-[11px] text-ink-500">
                  <span>{ann.date}</span>
                  <span>{ann.author}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
