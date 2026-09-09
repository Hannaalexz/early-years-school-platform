import React, { useEffect, useState } from 'react';
import {
  Baby,
  UserCheck,
  UserX,
  GraduationCap,
  FileText,
  AlertTriangle,
  Clock,
  AlertCircle,
  Plus,
  Shield,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { api } from '../../services/api.js';
import { AuditLog } from '../../types/index.js';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboardStats(), api.getAuditLogs()])
      .then(([statsRes, logsRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (logsRes.success) setAuditLogs(logsRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = stats?.kpis || {
    totalChildren: 18,
    presentToday: 16,
    absentToday: 2,
    totalStaff: 5,
    pendingApplications: 5,
    attendanceRate: 88.9,
  };

  const classrooms = stats?.classroomCapacities || [
    { name: 'Sunshine Classroom (KG1)', enrolled: 6, capacity: 18, fill: 33.3 },
    { name: 'Rainbow Classroom (Nursery)', enrolled: 4, capacity: 16, fill: 25 },
    { name: 'Butterfly Room (Toddlers)', enrolled: 4, capacity: 12, fill: 33.3 },
    { name: 'Little Explorers (KG2)', enrolled: 4, capacity: 20, fill: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-primary-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/40 text-primary-100 text-xs font-bold mb-3 border border-primary-400/30">
            <Shield size={13} />
            <span>School Director Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, Martha 👋
          </h2>
          <p className="text-primary-50 text-xs sm:text-sm mt-1 max-w-xl font-medium">
            Bubbles Early Years School is in full session. 18 registered early-years children with active care monitoring across all 4 classrooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="terracotta"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => onNavigate('/children/all')}
          >
            Register Child
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('/children/all')}
          >
            Children Directory
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Children"
          value="18"
          subtitle="Enrolled (1–6 yrs)"
          icon={<Baby size={20} />}
          colorScheme="primary"
          onClick={() => onNavigate('/children/all')}
        />
        <StatCard
          title="Present Today"
          value="16"
          subtitle="89% on site"
          icon={<UserCheck size={20} />}
          colorScheme="primary"
          trend={{ value: '89%', isPositive: true }}
          onClick={() => onNavigate('/children/attendance')}
        />
        <StatCard
          title="Absent"
          value="2"
          subtitle="2 reported sick"
          icon={<UserX size={20} />}
          colorScheme="dustyrose"
          onClick={() => onNavigate('/children/attendance')}
        />
        <StatCard
          title="Teachers & Staff"
          value="5"
          subtitle="All active"
          icon={<GraduationCap size={20} />}
          colorScheme="primary"
          onClick={() => onNavigate('/staff/teachers')}
        />
        <StatCard
          title="Care & Allergy"
          value="7"
          subtitle="Diet/Medical Flags"
          icon={<AlertTriangle size={20} />}
          colorScheme="amber"
          onClick={() => onNavigate('/children/all')}
        />
        <StatCard
          title="Admissions"
          value="5"
          subtitle="Tours / Enquiries"
          icon={<FileText size={20} />}
          colorScheme="terracotta"
          onClick={() => onNavigate('/admissions/enquiries')}
        />
      </div>

      {/* Middle Section: Classroom Capacities & Care Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Classroom Enrollment & Rooms"
          subtitle="Early childhood distribution"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('/children/all')}
            >
              View Roster
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {classrooms.map((c: any) => (
              <div key={c.name} className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-ink-900">{c.name}</span>
                  <span className="font-semibold text-ink-600">
                    {c.enrolled} / {c.capacity} Children ({c.fill}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-ivory-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500"
                    style={{ width: `${Math.max(c.fill, 15)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Care Summary */}
        <Card
          title="Today's Care Pulse"
          subtitle="Daily operational wellness"
          className="space-y-3"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50 border border-primary-200 text-xs">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary-700" />
                <span className="font-semibold text-primary-900">Check-in Status</span>
              </div>
              <Badge variant="success">15 on-time / 1 late</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-terracotta-500" />
                <span className="font-medium text-ink-800">Nap Rest Time</span>
              </div>
              <Badge variant="warning">Toddlers Resting</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-primary-700" />
                <span className="font-medium text-ink-800">Incident Reports</span>
              </div>
              <Badge variant="success">0 incidents</Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory-100 text-xs text-ink-600 space-y-1 border border-ivory-200">
              <p className="font-bold text-ink-900">Nutrition & Diaper Log:</p>
              <p>Morning oatmeal & fruit completed. Butterfly Room toddler diaper checks recorded on schedule.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Audit Log */}
      <Card
        title="Audit Trail & Security Activity"
        subtitle="Recent administrative events logged in PostgreSQL"
        action={
          <Badge variant="neutral">{auditLogs.length} logged actions</Badge>
        }
      >
        <div className="divide-y divide-ivory-200">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-900 border border-primary-200 flex items-center justify-center font-bold text-[10px]">
                  LOG
                </div>
                <div>
                  <p className="font-bold text-ink-900">{log.action}</p>
                  <p className="text-ink-500 text-[11px]">
                    User: {log.first_name ? `${log.first_name} ${log.last_name}` : log.user_email || 'System'} ({log.role_id || 'system'})
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-ink-400">
                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
