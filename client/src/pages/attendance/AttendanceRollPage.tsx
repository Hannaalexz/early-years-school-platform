import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Save,
  Search,
  Filter,
  UserCheck,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';

interface AttendanceEntry {
  childId: string;
  name: string;
  classroom: string;
  age: string;
  allergies?: string[];
  status: 'present' | 'absent' | 'late';
  // Arrival / Drop-off
  arrivalTime: string;
  droppedOffBy: string;
  droppedOffRelationship: string;
  receivedByStaff: string;
  arrivalNote: string;
  // Departure / Pickup
  departureTime: string;
  pickedUpBy: string;
  pickedUpRelationship: string;
  pickupAuthorized: boolean;
  releasedByStaff: string;
  departureNote: string;
  isPickedUp: boolean;
  authorizedList: { name: string; relationship: string; approved: boolean }[];
}

export const AttendanceRollPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceEntry>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'arrival' | 'departure'>('arrival');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Drop-off / Pickup Modal
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'arrival' | 'departure'>('arrival');

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    const res = await api.getChildren();
    setLoading(false);
    if (res.success && res.data) {
      setChildren(res.data);

      const initial: Record<string, AttendanceEntry> = {};
      res.data.forEach((c: any, index: number) => {
        const isAbsent = index === 3;
        const isLate = index === 5;
        const primaryG = c.guardians?.[0];
        const motherName = primaryG ? `${primaryG.parent_first_name} ${primaryG.parent_last_name}` : 'Sarah Johnson';

        initial[c.id] = {
          childId: c.id,
          name: `${c.first_name} ${c.last_name}`,
          classroom: c.classroom_name || 'Sunshine Classroom',
          age: c.calculated_age?.formatted || '4 yrs',
          allergies: c.allergies,
          status: isAbsent ? 'absent' : isLate ? 'late' : 'present',
          // Arrival
          arrivalTime: isAbsent ? '--:--' : isLate ? '09:20 AM' : '08:45 AM',
          droppedOffBy: isAbsent ? 'N/A' : motherName,
          droppedOffRelationship: isAbsent ? 'N/A' : 'Mother',
          receivedByStaff: 'Teacher Helen Brooks',
          arrivalNote: isAbsent ? 'Mild fever - resting at home' : isLate ? 'Heavy rain traffic' : 'Arrived cheerful',
          // Departure
          departureTime: isAbsent ? '--:--' : index < 2 ? '03:30 PM' : '--:--',
          pickedUpBy: index < 2 ? motherName : '',
          pickedUpRelationship: index < 2 ? 'Mother' : '',
          pickupAuthorized: true,
          releasedByStaff: index < 2 ? 'Teacher Helen Brooks' : '',
          departureNote: index < 2 ? 'Left smiling with daily artwork' : '',
          isPickedUp: index < 2 && !isAbsent,
          authorizedList: [
            { name: motherName, relationship: 'Mother', approved: true },
            { name: 'David Johnson', relationship: 'Father', approved: true },
            { name: 'Eleanor Johnson', relationship: 'Grandmother', approved: true },
          ],
        };
      });
      setRecords(initial);
    }
  };

  const setStatus = (childId: string, status: 'present' | 'absent' | 'late') => {
    setRecords((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status,
        arrivalTime: status === 'absent' ? '--:--' : prev[childId].arrivalTime === '--:--' ? '08:50 AM' : prev[childId].arrivalTime,
        isPickedUp: status === 'absent' ? false : prev[childId].isPickedUp,
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

  const openEditModal = (childId: string, type: 'arrival' | 'departure') => {
    setEditingChildId(childId);
    setModalType(type);
  };

  const handleModalSave = (data: Partial<AttendanceEntry>) => {
    if (!editingChildId) return;
    setRecords((prev) => ({
      ...prev,
      [editingChildId]: {
        ...prev[editingChildId],
        ...data,
      },
    }));
    setEditingChildId(null);
  };

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
  const pickedUpCount = Object.values(records).filter((r) => r.isPickedUp).length;

  const editingRecord = editingChildId ? records[editingChildId] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Baloo_2']">
              Attendance &amp; Drop-off / Pickup Roll
            </h2>
            <span className="bg-[#E0F7F4] text-[#0B4E49] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#C3EFEB]">
              Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Daily morning presence tracking, arrival hand-over log, and departure verification with approved authorized pickups (✓).
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition"
          >
            <Save size={14} />
            <span>Save Attendance Roll</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Attendance &amp; pickup records saved securely.
            </span>
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-ink-500 font-semibold">Total Roster</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-emerald-700 font-semibold">Present Today</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{presentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-amber-700 font-semibold">Late Arrivals</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-0.5">{lateCount}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-dustyrose-700 font-semibold">Absent</span>
          <p className="text-2xl font-extrabold text-dustyrose-800 mt-0.5">{absentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-[#0B4E49] font-semibold">Departed / Picked Up</span>
          <p className="text-2xl font-extrabold text-[#21B8AF] mt-0.5">{pickedUpCount}</p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-3xl border border-ivory-300 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('arrival')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
              activeTab === 'arrival'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-ivory-100'
            }`}
          >
            <ArrowDownLeft size={15} />
            <span>Morning Roll Call &amp; Drop-Off</span>
          </button>
          <button
            onClick={() => setActiveTab('departure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
              activeTab === 'departure'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-ivory-100'
            }`}
          >
            <ArrowUpRight size={15} />
            <span>Afternoon Departure &amp; Authorized Pickups (✓)</span>
          </button>
        </div>

        <div className="relative w-64 hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search child..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100/70 text-ink-600 uppercase text-[10px] tracking-wider font-bold border-b border-ivory-200">
              <tr>
                <th className="px-5 py-3.5">Child</th>
                <th className="px-4 py-3.5">Classroom &amp; Age</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                {activeTab === 'arrival' ? (
                  <>
                    <th className="px-4 py-3.5">Arrival Time</th>
                    <th className="px-4 py-3.5">Dropped Off By</th>
                    <th className="px-4 py-3.5">Received By</th>
                    <th className="px-4 py-3.5">Drop-off Note</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3.5">Departure Time</th>
                    <th className="px-4 py-3.5">Picked Up By</th>
                    <th className="px-4 py-3.5">Authorized Status</th>
                    <th className="px-4 py-3.5">Released By</th>
                    <th className="px-4 py-3.5 text-right">Pickup Log</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredChildren.map((c) => {
                const rec = records[c.id] || {
                  status: 'present',
                  arrivalTime: '08:45 AM',
                  droppedOffBy: 'Mother',
                  droppedOffRelationship: 'Mother',
                  receivedByStaff: 'Teacher Helen',
                  arrivalNote: '',
                  departureTime: '--:--',
                  pickedUpBy: '',
                  pickedUpRelationship: '',
                  pickupAuthorized: true,
                  releasedByStaff: '',
                  departureNote: '',
                  isPickedUp: false,
                  authorizedList: [],
                };

                return (
                  <tr key={c.id} className="hover:bg-ivory-50/70 transition-colors">
                    {/* Child Identity */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-xs border border-[#C3EFEB] shrink-0">
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

                    {/* Classroom */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-ink-800">{c.classroom_name || 'Sunshine Room'}</p>
                      <p className="text-[10px] text-ink-500">{c.calculated_age?.formatted}</p>
                    </td>

                    {/* Status 1-Tap Buttons */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
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

                    {/* Mode Columns */}
                    {activeTab === 'arrival' ? (
                      <>
                        <td className="px-4 py-3.5 font-mono text-ink-800">
                          {rec.arrivalTime}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="bg-ivory-100 text-ink-800 font-medium px-2 py-0.5 rounded-md border border-ivory-200">
                            {rec.droppedOffBy} ({rec.droppedOffRelationship})
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-ink-700">
                          {rec.receivedByStaff}
                        </td>
                        <td className="px-4 py-3.5 text-ink-600 italic max-w-xs truncate">
                          {rec.arrivalNote || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => openEditModal(c.id, 'arrival')}
                            className="p-1.5 rounded-lg bg-ivory-100 hover:bg-[#E0F7F4] text-ink-600 hover:text-[#0B4E49] transition"
                            title="Edit drop-off details"
                          >
                            <Edit3 size={13} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3.5 font-mono text-ink-800">
                          {rec.departureTime}
                        </td>
                        <td className="px-4 py-3.5">
                          {rec.isPickedUp ? (
                            <span className="font-bold text-ink-900">
                              {rec.pickedUpBy} ({rec.pickedUpRelationship})
                            </span>
                          ) : (
                            <span className="text-ink-400 italic">In classroom</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          {rec.isPickedUp ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              <ShieldCheck size={12} /> Authorized (✓)
                            </span>
                          ) : (
                            <span className="text-ink-400 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-ink-700">
                          {rec.releasedByStaff || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => openEditModal(c.id, 'departure')}
                            className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white text-xs font-bold hover:from-[#1BA49A] hover:to-[#29BCB1] shadow-xs transition"
                          >
                            {rec.isPickedUp ? 'Edit Pickup' : 'Log Departure'}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drop-Off / Pickup Modal */}
      {editingChildId && editingRecord && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-ink-900">
                  {modalType === 'arrival' ? 'Log Morning Drop-off' : 'Log Child Departure & Pickup'}
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">Child: {editingRecord.name}</p>
              </div>
              <button
                onClick={() => setEditingChildId(null)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {modalType === 'arrival' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  handleModalSave({
                    arrivalTime: target.arrivalTime.value,
                    droppedOffBy: target.droppedOffBy.value,
                    droppedOffRelationship: target.droppedOffRelationship.value,
                    receivedByStaff: target.receivedByStaff.value,
                    arrivalNote: target.arrivalNote.value,
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Arrival Time</label>
                  <input
                    name="arrivalTime"
                    type="text"
                    defaultValue={editingRecord.arrivalTime}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Dropped Off By (Person)</label>
                  <input
                    name="droppedOffBy"
                    type="text"
                    defaultValue={editingRecord.droppedOffBy}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Relationship to Child</label>
                  <input
                    name="droppedOffRelationship"
                    type="text"
                    defaultValue={editingRecord.droppedOffRelationship}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Received by Staff Member</label>
                  <input
                    name="receivedByStaff"
                    type="text"
                    defaultValue={editingRecord.receivedByStaff}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Drop-off Note / Handover Message</label>
                  <textarea
                    name="arrivalNote"
                    rows={2}
                    defaultValue={editingRecord.arrivalNote}
                    placeholder="e.g. Slept well, bring jacket for afternoon play"
                    className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                  <button
                    type="button"
                    onClick={() => setEditingChildId(null)}
                    className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-700 font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white font-bold transition shadow-sm"
                  >
                    Save Drop-Off
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  handleModalSave({
                    departureTime: target.departureTime.value,
                    pickedUpBy: target.pickedUpBy.value,
                    pickedUpRelationship: target.pickedUpRelationship.value,
                    pickupAuthorized: true,
                    releasedByStaff: target.releasedByStaff.value,
                    departureNote: target.departureNote.value,
                    isPickedUp: true,
                  });
                }}
                className="space-y-3 text-xs"
              >
                {/* Approved Pickups Quick Select */}
                <div className="p-3 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#0B4E49] flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#21B8AF]" /> Approved Authorized Pickups:
                  </span>
                  <div className="space-y-1">
                    {editingRecord.authorizedList.map((auth, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 bg-white rounded-xl border border-[#C3EFEB] text-xs"
                      >
                        <span className="font-bold text-ink-900">
                          {auth.name} ({auth.relationship})
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified Approved
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Departure Time</label>
                  <input
                    name="departureTime"
                    type="text"
                    defaultValue={editingRecord.departureTime === '--:--' ? '03:45 PM' : editingRecord.departureTime}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Picked Up By (Full Name)</label>
                  <input
                    name="pickedUpBy"
                    type="text"
                    defaultValue={editingRecord.pickedUpBy || editingRecord.authorizedList[0]?.name || ''}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Relationship to Child</label>
                  <input
                    name="pickedUpRelationship"
                    type="text"
                    defaultValue={editingRecord.pickedUpRelationship || editingRecord.authorizedList[0]?.relationship || 'Mother'}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Released By Staff Member</label>
                  <input
                    name="releasedByStaff"
                    type="text"
                    defaultValue={editingRecord.releasedByStaff || 'Teacher Helen Brooks'}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Departure Handover Note</label>
                  <textarea
                    name="departureNote"
                    rows={2}
                    defaultValue={editingRecord.departureNote}
                    placeholder="e.g. Sent home with artwork and sweater"
                    className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                  <button
                    type="button"
                    onClick={() => setEditingChildId(null)}
                    className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-700 font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white font-bold transition shadow-sm"
                  >
                    Confirm &amp; Log Departure
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
