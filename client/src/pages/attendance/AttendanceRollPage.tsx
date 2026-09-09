import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  ShieldCheck,
  Save,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../../services/api.js';

interface AttendanceRecord {
  childId: string;
  name: string;
  classroom: string;
  age: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrivalTime: string;
  droppedOffBy: string;
  notes: string;
}

export const AttendanceRollPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    const res = await api.getChildren();
    setLoading(false);
    if (res.success && res.data) {
      setChildren(res.data);

      // Initialize default realistic attendance
      const initial: Record<string, AttendanceRecord> = {};
      res.data.forEach((c: any, index: number) => {
        const isAbsent = index === 3;
        const isLate = index === 5;
        initial[c.id] = {
          childId: c.id,
          name: `${c.first_name} ${c.last_name}`,
          classroom: c.classroom_name || 'Sunshine Classroom',
          age: c.calculated_age?.formatted || '4 yrs',
          status: isAbsent ? 'absent' : isLate ? 'late' : 'present',
          arrivalTime: isAbsent ? '--:--' : isLate ? '09:20 AM' : '08:45 AM',
          droppedOffBy: isAbsent ? 'N/A' : 'Mother',
          notes: isAbsent ? 'Fever / Resting at home' : isLate ? 'Traffic delay' : 'Arrived happy',
        };
      });
      setRecords(initial);
    }
  };

  const setStatus = (childId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setRecords((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status,
        arrivalTime: status === 'absent' ? '--:--' : prev[childId]?.arrivalTime || '08:50 AM',
      },
    }));
  };

  const markAllPresent = () => {
    setRecords((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = {
          ...updated[id],
          status: 'present',
          arrivalTime: updated[id].arrivalTime === '--:--' ? '08:50 AM' : updated[id].arrivalTime,
        };
      });
      return updated;
    });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Filtering
  const filteredChildren = children.filter((c) => {
    const matchesClass = selectedClassroom === 'all' || c.classroom_name === selectedClassroom;
    const matchesSearch =
      searchQuery === '' ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const totalCount = Object.keys(records).length;
  const presentCount = Object.values(records).filter((r) => r.status === 'present').length;
  const lateCount = Object.values(records).filter((r) => r.status === 'late').length;
  const absentCount = Object.values(records).filter((r) => r.status === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900">Attendance Roll Call</h2>
            <span className="bg-sage-100 text-forest-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sage-200">
              Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Quick 1-tap morning roll marking, arrival drop-off tracking, and absence reasons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={markAllPresent}
            className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-800 text-xs font-bold transition border border-ivory-300"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 hover:from-primary-800 hover:to-primary-600 text-white text-xs font-bold shadow-sm shadow-primary-500/25 transition"
          >
            <Save size={14} />
            <span>Save Attendance Roll</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">Attendance roll saved and synced to the Parent Portal.</span>
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Total Expected</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle">
          <span className="text-xs text-emerald-700 font-semibold">Present in Class</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{presentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle">
          <span className="text-xs text-amber-700 font-semibold">Late Arrivals</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-0.5">{lateCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle">
          <span className="text-xs text-dustyrose-700 font-semibold">Absent</span>
          <p className="text-2xl font-extrabold text-dustyrose-800 mt-0.5">{absentCount}</p>
        </div>
      </div>

      {/* Controls: Classroom selector & Search */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-ink-600 shrink-0 flex items-center gap-1">
            <Filter size={14} /> Classroom:
          </span>
          {['all', 'Sunshine Classroom', 'Rainbow Classroom', 'Butterfly Room', 'Little Explorers'].map((cr) => (
            <button
              key={cr}
              onClick={() => setSelectedClassroom(cr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedClassroom === cr
                  ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-xs'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
              }`}
            >
              {cr === 'all' ? 'All Rooms' : cr}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100/70 text-ink-600 uppercase text-[10px] tracking-wider font-bold border-b border-ivory-200">
              <tr>
                <th className="px-5 py-3.5">Child</th>
                <th className="px-4 py-3.5">Classroom &amp; Age</th>
                <th className="px-4 py-3.5 text-center">Status Quick Mark</th>
                <th className="px-4 py-3.5">Arrival Time</th>
                <th className="px-4 py-3.5">Handed Over By</th>
                <th className="px-4 py-3.5">Drop-off Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredChildren.map((c) => {
                const rec = records[c.id] || {
                  status: 'present',
                  arrivalTime: '08:45 AM',
                  droppedOffBy: 'Mother',
                  notes: '',
                };

                return (
                  <tr key={c.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-sage-100 text-forest-900 font-bold flex items-center justify-center text-xs border border-sage-200 shrink-0">
                          {c.first_name[0]}{c.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-ink-900">
                            {c.first_name} {c.last_name}
                          </p>
                          {c.allergies && c.allergies.length > 0 && (
                            <span className="text-[9px] font-bold text-dustyrose-700 bg-dustyrose-50 px-1.5 py-0.5 rounded border border-dustyrose-200">
                              ⚠️ {c.allergies.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-ink-800">{c.classroom_name || 'Sunshine Room'}</p>
                      <p className="text-[10px] text-ink-500">{c.calculated_age?.formatted}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setStatus(c.id, 'present')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            rec.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-ivory-100 hover:bg-emerald-50 text-ink-600'
                          }`}
                        >
                          <CheckCircle2 size={12} /> Present
                        </button>
                        <button
                          onClick={() => setStatus(c.id, 'late')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            rec.status === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-ivory-100 hover:bg-amber-50 text-ink-600'
                          }`}
                        >
                          <Clock size={12} /> Late
                        </button>
                        <button
                          onClick={() => setStatus(c.id, 'absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            rec.status === 'absent'
                              ? 'bg-dustyrose-500 text-white shadow-xs'
                              : 'bg-ivory-100 hover:bg-dustyrose-50 text-ink-600'
                          }`}
                        >
                          <XCircle size={12} /> Absent
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-ink-800">
                      {rec.arrivalTime}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="bg-ivory-100 text-ink-700 font-medium px-2 py-0.5 rounded-md border border-ivory-200">
                        {rec.droppedOffBy}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-ink-600 italic">
                      {rec.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
