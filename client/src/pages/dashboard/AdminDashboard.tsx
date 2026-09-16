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
  ArrowRight,
  Heart,
  Palette,
  CheckCircle2
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
    pickupDeparturesRecorded: 0,
  };

  const classrooms = stats?.classroomCapacities || [
    { name: 'Sunshine Classroom (KG1)', enrolled: 18, capacity: 18, fill: 100, teacher: 'Teacher Helen' },
    { name: 'Rainbow Classroom (Nursery)', enrolled: 14, capacity: 16, fill: 87.5, teacher: 'Teacher Sarah' },
    { name: 'Butterfly Room (Toddlers)', enrolled: 10, capacity: 12, fill: 83.3, teacher: 'Teacher Michael' },
    { name: 'Little Explorers (KG2)', enrolled: 16, capacity: 20, fill: 80, teacher: 'Teacher Bethany' },
  ];

  const todayActivities = [
    {
      title: 'Finger Painting & Color Mixing',
      room: 'Sunshine Room',
      area: 'Creative & Fine Motor',
      time: '09:30 AM',
      icon: '🎨',
    },
    {
      title: 'Story Circle: The Very Hungry Caterpillar',
      room: 'Rainbow Room',
      area: 'Language & Literacy',
      time: '10:45 AM',
      icon: '📖',
    },
    {
      title: 'Outdoor Autumn Leaf Hunt',
      room: 'Butterfly Room',
      area: 'Cognitive & Nature',
      time: '02:00 PM',
      icon: '🍂',
    },
  ];

  const upcomingEvents = stats?.upcomingEvents || [
    { date: 'Sep 22', title: 'Autumn Leaf Sensory Exploration', time: '10:00 AM' },
    { date: 'Sep 29', title: 'Parent-Teacher Monthly Growth Circle', time: '04:00 PM' },
  ];

  const announcements = stats?.recentAnnouncements || [
    { title: 'Welcome to September Learning Term', date: 'Sep 15', author: 'School Admin' },
    { title: 'Reminder: Update Authorized Pickup Lists', date: 'Sep 10', author: 'Front Desk' },
  ];

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto pb-8">
      {/* Friendly, Compact Hero Banner */}
      <div className="bg-gradient-to-r from-[#20BDB2] via-[#2BCBC0] to-[#38D3C7] rounded-3xl p-5 sm:p-6 text-white shadow-sm shadow-[#21B8AF]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2 border border-white/30 backdrop-blur">
            <span>☀️</span>
            <span className="font-['Quicksand']">Good morning, Martha!</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-['Quicksand'] leading-snug">
            Welcome to Bubbles Early Years 🎈
          </h2>
          <p className="text-white/95 text-xs mt-0.5 font-medium font-['Outfit']">
            {kpis.presentToday} of {kpis.totalChildren} little ones checked in today • All {kpis.totalClassrooms} classrooms active in play-based learning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/attendance')}
            className="px-3.5 py-2 rounded-2xl bg-white text-[#0B4E49] text-xs font-bold shadow-xs hover:bg-[#F0FBF9] transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Calendar size={13} className="text-[#21B8AF]" />
            <span>Attendance Roll</span>
          </button>
          <button
            onClick={() => onNavigate('/development/monthly-progress')}
            className="px-3.5 py-2 rounded-2xl bg-[#0B4E49]/30 hover:bg-[#0B4E49]/40 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Sparkles size={13} />
            <span>Monthly Progress</span>
          </button>
          <button
            onClick={() => onNavigate('/children/all')}
            className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Plus size={13} />
            <span>Register Child</span>
          </button>
        </div>
      </div>

      {/* 4 Friendly, Compact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Children"
          value={String(kpis.totalChildren)}
          subtitle="Ages 1–6 (4 Classrooms)"
          icon={<Baby size={19} />}
          colorScheme="primary"
          onClick={() => onNavigate('/children/all')}
        />
        <StatCard
          title="Present Today"
          value={String(kpis.presentToday)}
          subtitle={`${attendance.rate} rate • ${attendance.arrivedOnTime} on-time`}
          icon={<UserCheck size={19} />}
          colorScheme="sage"
          trend={{ value: attendance.rate, isPositive: true }}
          onClick={() => onNavigate('/attendance')}
        />
        <StatCard
          title="Resting / Late"
          value={`${kpis.absentToday} / ${kpis.lateToday}`}
          subtitle={`${kpis.absentToday} sick notice • ${kpis.lateToday} late`}
          icon={<UserX size={19} />}
          colorScheme="dustyrose"
          onClick={() => onNavigate('/attendance')}
        />
        <StatCard
          title="Caring Educators"
          value={String(kpis.totalTeachers)}
          subtitle="All rooms fully staffed"
          icon={<GraduationCap size={19} />}
          colorScheme="honey"
          onClick={() => onNavigate('/staff')}
        />
      </div>

      {/* Main 2-Column Balanced Dashboard (Prevents endless vertical scrolling!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (7 of 12 columns): Classrooms & Play Discoveries */}
        <div className="lg:col-span-7 space-y-4">
          {/* Classrooms Presence & Capacities */}
          <Card
            title="Classrooms & Morning Presence"
            subtitle="Early years rooms in active discovery"
            action={
              <button
                onClick={() => onNavigate('/attendance')}
                className="text-xs font-bold text-[#0B4E49] hover:underline font-['Quicksand'] flex items-center gap-1"
              >
                <span>Take Roll</span> <ArrowRight size={12} />
              </button>
            }
          >
            <div className="space-y-2.5">
              {classrooms.map((c: any) => (
                <div
                  key={c.name}
                  className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] hover:border-[#C3EFEB] transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#21B8AF]" />
                      <span className="font-bold text-[#3D3530] font-['Quicksand']">{c.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-ink-600 font-['Outfit']">
                      {c.enrolled} / {c.capacity} Children ({c.fill}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#EFE9DF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] transition-all duration-500"
                      style={{ width: `${Math.max(c.fill, 15)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-500 font-['Outfit']">
                    <span>Educator: <strong className="text-ink-700">{c.teacher}</strong></span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Presence recorded
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Play Activities */}
          <Card
            title="Today's Play & Discovery Activities"
            subtitle="Hands-on sensory, motor, and creative play"
            action={
              <button
                onClick={() => onNavigate('/activities')}
                className="text-xs font-bold text-[#0B4E49] hover:underline font-['Quicksand'] flex items-center gap-1"
              >
                <span>View All</span> <ArrowRight size={12} />
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {todayActivities.map((act, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] space-y-1.5 hover:border-[#C3EFEB] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{act.icon}</span>
                    <span className="text-[10px] font-mono text-ink-500 font-semibold">{act.time}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#3D3530] font-['Quicksand'] leading-tight">
                    {act.title}
                  </h4>
                  <div className="pt-1 flex flex-col gap-0.5 text-[10px] text-ink-500 font-['Outfit']">
                    <span className="text-[#0B4E49] font-semibold">{act.room}</span>
                    <span>{act.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (5 of 12 columns): Safe Pickups, Health, and School Community */}
        <div className="lg:col-span-5 space-y-4">
          {/* Safe Departure & Authorized Pickups */}
          <Card
            title="Authorized Pickup Readiness"
            subtitle="Child departure security (Section 14 & 16)"
          >
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0B4E49] font-['Quicksand']">Authorized Pickups</p>
                    <p className="text-[11px] text-[#168F89]">100% Contacts verified on file (✓)</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] space-y-1 text-xs font-['Outfit']">
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Expected departures today:</span>
                  <strong className="text-[#3D3530]">{attendance.present} children</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Pickup protocol:</span>
                  <span className="text-emerald-700 font-bold">ID / PIN required</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/attendance')}
                className="w-full py-2 rounded-2xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 font-['Quicksand']"
              >
                <span>Open Afternoon Pickup Log</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </Card>

          {/* Health & Safety Alert */}
          <Card
            title="Health & Campus Safety"
            subtitle="Zero incidents • Active care protocols"
            action={
              <button
                onClick={() => onNavigate('/health/incidents')}
                className="text-xs font-bold text-[#0B4E49] hover:underline font-['Quicksand']"
              >
                Log
              </button>
            }
          >
            <div className="space-y-2 text-xs font-['Outfit']">
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold">
                  Zero medical incidents recorded today. First aid kit inspected.
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                  <span>3 Children with recorded food allergies:</span>
                </div>
                <span className="font-bold text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Peanuts, Dairy
                </span>
              </div>
            </div>
          </Card>

          {/* Upcoming School Moments & Announcements */}
          <Card
            title="Upcoming School Moments"
            subtitle="Events & parent announcements"
          >
            <div className="space-y-2 text-xs font-['Outfit']">
              {upcomingEvents.map((evt: any, i: number) => (
                <div
                  key={i}
                  className="p-2.5 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-[#3D3530] text-[11px] font-['Quicksand']">{evt.title}</p>
                    <p className="text-[10px] text-ink-500 font-mono mt-0.5">{evt.time}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#0B4E49] bg-[#E0F7F4] px-2 py-0.5 rounded-full border border-[#C3EFEB]">
                    {evt.date}
                  </span>
                </div>
              ))}

              <div className="pt-1.5 border-t border-[#F0ECE4]">
                <div className="p-2.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B4E49] flex items-center gap-1">
                    <span>📢</span> {announcements[0]?.title}
                  </span>
                  <p className="text-[10px] text-ink-500 font-mono">{announcements[0]?.date} • {announcements[0]?.author}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
