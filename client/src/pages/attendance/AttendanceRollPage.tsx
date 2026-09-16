import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Save,
  Search,
  Printer,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Edit3,
  X,
  AlertTriangle,
  Heart,
  Smile,
  Thermometer
} from 'lucide-react';
import { api } from '../../services/api.js';
import { Pagination } from '../../components/common/Pagination.js';

interface AttendanceEntry {
  childId: string;
  name: string;
  classroom: string;
  age: string;
  allergies?: string[];
  status: 'present' | 'absent' | 'late';
  // Arrival / Morning Status
  arrivalTime: string;
  arrivalNote: string;
  healthStatus: 'healthy' | 'monitor' | 'medication';
  // Departure / Pickup
  departureTime: string;
  pickedUpBy: string;
  pickedUpRelationship: string;
  pickupAuthorized: boolean;
  releasedByStaff: string;
  departureNote: string;
  isPickedUp: boolean;
  authorizedList: { name: string; relationship: string; phone?: string; approved: boolean }[];
}

export const AttendanceRollPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceEntry>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'arrival' | 'departure'>('arrival');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Modal State
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
          arrivalNote: isAbsent
            ? 'Mild fever — resting at home'
            : isLate
            ? 'Heavy rain traffic'
            : index === 0
            ? 'Arrived cheerful 🎈'
            : '',
          healthStatus: isAbsent ? 'monitor' : 'healthy',
          // Departure
          departureTime: isAbsent ? '--:--' : index < 2 ? '03:30 PM' : '--:--',
          pickedUpBy: index < 2 ? motherName : '',
          pickedUpRelationship: index < 2 ? 'Mother' : '',
          pickupAuthorized: true,
          releasedByStaff: index < 2 ? 'Teacher Helen Brooks' : '',
          departureNote: index < 2 ? 'Left smiling with daily artwork' : '',
          isPickedUp: index < 2 && !isAbsent,
          authorizedList: [
            { name: motherName, relationship: 'Mother', phone: primaryG?.phone || '+1 555-0123', approved: true },
            { name: 'David Johnson', relationship: 'Father', phone: '+1 555-0124', approved: true },
            { name: 'Eleanor Johnson', relationship: 'Grandmother', phone: '+1 555-0199', approved: true },
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
        arrivalTime:
          status === 'absent'
            ? '--:--'
            : prev[childId].arrivalTime === '--:--'
            ? status === 'late'
              ? '09:15 AM'
              : '08:45 AM'
            : prev[childId].arrivalTime,
        isPickedUp: status === 'absent' ? false : prev[childId].isPickedUp,
      },
    }));
  };

  const markAllPresent = () => {
    setRecords((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        // If classroom filter is applied, only mark children in that room
        if (selectedClassroom === 'all' || updated[id].classroom === selectedClassroom) {
          updated[id] = {
            ...updated[id],
            status: 'present',
            arrivalTime: updated[id].arrivalTime === '--:--' ? '08:45 AM' : updated[id].arrivalTime,
          };
        }
      });
      return updated;
    });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrintRoll = () => {
    window.print();
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

  // Calculate stats
  const totalCount = Object.keys(records).length;
  const presentCount = Object.values(records).filter((r) => r.status === 'present').length;
  const lateCount = Object.values(records).filter((r) => r.status === 'late').length;
  const absentCount = Object.values(records).filter((r) => r.status === 'absent').length;
  const pickedUpCount = Object.values(records).filter((r) => r.isPickedUp).length;
  const allergyCount = Object.values(records).filter(
    (r) => (r.allergies && r.allergies.length > 0 && r.status !== 'absent')
  ).length;

  // Counts per classroom for filter pills
  const getClassroomAttendanceCount = (roomName: string) => {
    const inRoom = Object.values(records).filter((r) => r.classroom === roomName);
    const presentInRoom = inRoom.filter((r) => r.status === 'present' || r.status === 'late').length;
    return `${presentInRoom}/${inRoom.length}`;
  };

  const editingRecord = editingChildId ? records[editingChildId] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Quicksand']">
              Morning Roll Call &amp; Departure Verification
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 font-['Outfit'] mt-0.5">
            Quick 1-tap presence tracking, morning arrival notes, and afternoon pickup authorization (✓).
          </p>
        </div>

        {/* Date Navigator & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-ivory-300 rounded-2xl p-1 shadow-2xs text-xs font-['Quicksand']">
            <button
              onClick={() => setSelectedDate('Sep 15, 2026')}
              className="p-1.5 hover:bg-ivory-100 rounded-xl text-ink-600 transition"
              title="Previous Day"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2.5 font-bold text-ink-900 flex items-center gap-1.5">
              <Calendar size={13} className="text-[#21B8AF]" />
              {selectedDate}
            </span>
            <button
              onClick={() => setSelectedDate('Sep 17, 2026')}
              className="p-1.5 hover:bg-ivory-100 rounded-xl text-ink-600 transition"
              title="Next Day"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={handlePrintRoll}
            className="px-3 py-2 rounded-2xl bg-white hover:bg-ivory-100 text-ink-700 text-xs font-bold transition border border-ivory-300 shadow-2xs flex items-center gap-1.5 font-['Quicksand']"
            title="Print Emergency Roll Call clipboard for fire drills or licensing"
          >
            <Printer size={14} className="text-ink-500" />
            <span>Print Roll</span>
          </button>

          <button
            onClick={markAllPresent}
            className="px-3.5 py-2 rounded-2xl bg-[#E0F7F4] hover:bg-[#C3EFEB] text-[#0B4E49] text-xs font-bold transition border border-[#C3EFEB] font-['Quicksand']"
          >
            ✓ Mark Room Present
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition font-['Quicksand']"
          >
            <Save size={14} />
            <span>Save Roll Call</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold font-['Outfit']">
              Attendance records and arrival notes saved successfully.
            </span>
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-['Outfit']">
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-ink-500 font-semibold">Total Roster</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-0.5">{totalCount}</p>
          <span className="text-[10px] text-ink-400">All 4 early childhood rooms</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-emerald-700 font-semibold">Present Today</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{presentCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">
            {totalCount > 0 ? `${Math.round((presentCount / totalCount) * 100)}% attendance rate` : '0%'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-amber-700 font-semibold">Late Arrivals</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-0.5">{lateCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Arrived after 09:00 AM</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-dustyrose-700 font-semibold">Absent</span>
          <p className="text-2xl font-extrabold text-dustyrose-800 mt-0.5">{absentCount}</p>
          <span className="text-[10px] text-dustyrose-600 font-medium">Resting at home</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs">
          <span className="text-[11px] text-[#0B4E49] font-semibold">Departed (✓ Picked Up)</span>
          <p className="text-2xl font-extrabold text-[#21B8AF] mt-0.5">{pickedUpCount}</p>
          <span className="text-[10px] text-[#0B4E49] font-medium">
            {totalCount - absentCount - pickedUpCount} remaining in class
          </span>
        </div>
      </div>

      {/* Allergy & Safety Alert Banner (if any allergy present) */}
      {allergyCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span className="font-medium">
              <strong>Allergy Safety Reminder:</strong> There are{' '}
              <strong className="text-amber-800 underline">{allergyCount} children with recorded dietary/medical allergies</strong>{' '}
              present in school today. Please verify meal &amp; snack ingredients with the kitchen.
            </span>
          </div>
        </div>
      )}

      {/* Classroom Filter Pills with Live Ratios */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-3xl bg-white border border-ivory-300 shadow-2xs">
        <span className="text-xs font-bold text-ink-500 font-['Quicksand'] px-2">Classrooms:</span>
        {[
          { id: 'all', label: 'All Rooms', icon: '🏫', count: `${presentCount + lateCount}/${totalCount}` },
          { id: 'Sunshine Classroom', label: 'Sunshine (KG1)', icon: '☀️', count: getClassroomAttendanceCount('Sunshine Classroom') },
          { id: 'Rainbow Classroom', label: 'Rainbow (Nursery)', icon: '🌈', count: getClassroomAttendanceCount('Rainbow Classroom') },
          { id: 'Butterfly Room', label: 'Butterfly (Toddlers)', icon: '🦋', count: getClassroomAttendanceCount('Butterfly Room') },
          { id: 'Little Explorers', label: 'Little Explorers (KG2)', icon: '🔍', count: getClassroomAttendanceCount('Little Explorers') },
        ].map((room) => {
          const isSelected = selectedClassroom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => {
                setSelectedClassroom(room.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 font-['Quicksand'] ${
                isSelected
                  ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                  : 'bg-ivory-50 text-ink-700 hover:bg-[#F0FBF9] hover:text-[#0B4E49] border border-ivory-200'
              }`}
            >
              <span>{room.icon}</span>
              <span>{room.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-ivory-200 text-ink-600'
                }`}
              >
                {room.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Mode Switcher (Arrival vs Departure), Search, View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-2 rounded-3xl border border-ivory-300 shadow-xs gap-3">
        {/* Mode Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('arrival')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition font-['Quicksand'] ${
              activeTab === 'arrival'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-ivory-100'
            }`}
          >
            <span>☀️ Morning Roll Call</span>
          </button>
          <button
            onClick={() => setActiveTab('departure')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition font-['Quicksand'] ${
              activeTab === 'departure'
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                : 'text-ink-600 hover:bg-ivory-100'
            }`}
          >
            <span>🏠 Afternoon Departure &amp; Pickups (✓)</span>
          </button>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search child by name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
            />
          </div>

          <div className="flex items-center bg-ivory-100 p-0.5 rounded-xl border border-ivory-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white text-[#0B4E49] shadow-2xs font-bold' : 'text-ink-400 hover:text-ink-700'
              }`}
              title="Table View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-white text-[#0B4E49] shadow-2xs font-bold' : 'text-ink-400 hover:text-ink-700'
              }`}
              title="Roster Card View (Tablet Friendly)"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards View */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-ivory-300 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-100/70 text-ink-600 uppercase text-[10px] tracking-wider font-bold border-b border-ivory-200 font-['Quicksand']">
                <tr>
                  <th className="px-5 py-3.5">Child</th>
                  <th className="px-4 py-3.5">Classroom &amp; Age</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  {activeTab === 'arrival' ? (
                    <>
                      <th className="px-4 py-3.5">Arrival Time</th>
                      <th className="px-4 py-3.5">Morning Note / Health Check</th>
                      <th className="px-4 py-3.5 text-right">Quick Note</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3.5">Departure Time</th>
                      <th className="px-4 py-3.5">Picked Up By</th>
                      <th className="px-4 py-3.5">Authorized Status</th>
                      <th className="px-4 py-3.5">Released By Staff</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 font-['Outfit']">
                {filteredChildren.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-ink-400">
                      No children found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredChildren
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((c) => {
                      const rec = records[c.id] || {
                        status: 'present',
                        arrivalTime: '08:45 AM',
                        arrivalNote: '',
                        healthStatus: 'healthy',
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
                              <div className="w-9 h-9 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-xs border border-[#C3EFEB] shrink-0 font-['Quicksand']">
                                {c.first_name[0]}{c.last_name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-ink-900 font-['Quicksand']">
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

                          {/* Classroom & Age */}
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-ink-800">{c.classroom_name || 'Sunshine Room'}</p>
                            <p className="text-[10px] text-ink-500">{c.calculated_age?.formatted}</p>
                          </td>

                          {/* 1-Tap Status Toggle */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1 font-['Quicksand']">
                              <button
                                onClick={() => setStatus(c.id, 'present')}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                  rec.status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-ivory-100 hover:bg-emerald-50 text-ink-600'
                                }`}
                              >
                                <CheckCircle2 size={12} /> Present
                              </button>
                              <button
                                onClick={() => setStatus(c.id, 'late')}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                  rec.status === 'late'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-ivory-100 hover:bg-amber-50 text-ink-600'
                                }`}
                              >
                                <Clock size={12} /> Late
                              </button>
                              <button
                                onClick={() => setStatus(c.id, 'absent')}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
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
                              <td className="px-4 py-3.5 font-mono text-ink-800 font-bold">
                                {rec.arrivalTime}
                              </td>
                              <td className="px-4 py-3.5">
                                {rec.arrivalNote ? (
                                  <span className="text-xs text-ink-800 bg-ivory-100 px-2.5 py-1 rounded-xl border border-ivory-200 block max-w-sm truncate">
                                    {rec.arrivalNote}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-ink-400 italic">No notes</span>
                                )}
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <button
                                  onClick={() => openEditModal(c.id, 'arrival')}
                                  className="px-2.5 py-1 rounded-xl bg-ivory-100 hover:bg-[#E0F7F4] text-ink-600 hover:text-[#0B4E49] transition text-xs font-bold font-['Quicksand'] inline-flex items-center gap-1 border border-ivory-200"
                                  title="Add morning handover note or edit arrival time"
                                >
                                  <Edit3 size={12} /> Note
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3.5 font-mono text-ink-800 font-bold">
                                {rec.departureTime}
                              </td>
                              <td className="px-4 py-3.5">
                                {rec.isPickedUp ? (
                                  <span className="font-bold text-ink-900 font-['Quicksand']">
                                    {rec.pickedUpBy} ({rec.pickedUpRelationship})
                                  </span>
                                ) : (
                                  <span className="text-ink-400 italic text-[11px]">In classroom</span>
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
                                  className={`px-3 py-1 rounded-xl text-xs font-bold transition font-['Quicksand'] ${
                                    rec.isPickedUp
                                      ? 'bg-ivory-100 hover:bg-ivory-200 text-ink-800 border border-ivory-300'
                                      : 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white hover:from-[#1BA49A] hover:to-[#29BCB1] shadow-xs'
                                  }`}
                                >
                                  {rec.isPickedUp ? 'Edit' : 'Release (✓)'}
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-2.5 border-t border-ivory-200 bg-ivory-50/50">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredChildren.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 30]}
              itemLabel="children"
            />
          </div>
        </div>
      ) : (
        /* ROSTER CARDS VIEW (TABLET / TOUCH FRIENDLY) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredChildren
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((c) => {
                const rec = records[c.id] || {
                  status: 'present',
                  arrivalTime: '08:45 AM',
                  arrivalNote: '',
                  healthStatus: 'healthy',
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
                  <div
                    key={c.id}
                    className={`bg-white rounded-3xl p-4 border transition-all shadow-xs space-y-3 ${
                      rec.status === 'present'
                        ? 'border-[#C3EFEB] hover:border-[#20BDB2]'
                        : rec.status === 'late'
                        ? 'border-amber-200 hover:border-amber-300'
                        : 'border-dustyrose-200 hover:border-dustyrose-300'
                    }`}
                  >
                    {/* Top Row: Avatar, Name, Allergies */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-sm border border-[#C3EFEB] shrink-0 font-['Quicksand']">
                          {c.first_name[0]}{c.last_name[0]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-ink-900 font-['Quicksand']">
                            {c.first_name} {c.last_name}
                          </h4>
                          <p className="text-[11px] text-ink-500 font-['Outfit']">
                            {c.classroom_name || 'Sunshine Room'} • {c.calculated_age?.formatted}
                          </p>
                        </div>
                      </div>

                      {c.allergies && c.allergies.length > 0 && (
                        <span className="text-[9px] font-bold text-dustyrose-700 bg-dustyrose-50 px-2 py-0.5 rounded-full border border-dustyrose-200 shrink-0">
                          ⚠️ Allergy
                        </span>
                      )}
                    </div>

                    {/* Quick 1-Tap Status Selector */}
                    <div className="grid grid-cols-3 gap-1.5 font-['Quicksand'] text-xs font-bold">
                      <button
                        onClick={() => setStatus(c.id, 'present')}
                        className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                          rec.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-ivory-100 hover:bg-emerald-50 text-ink-700'
                        }`}
                      >
                        <CheckCircle2 size={12} /> Present
                      </button>
                      <button
                        onClick={() => setStatus(c.id, 'late')}
                        className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                          rec.status === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-ivory-100 hover:bg-amber-50 text-ink-700'
                        }`}
                      >
                        <Clock size={12} /> Late
                      </button>
                      <button
                        onClick={() => setStatus(c.id, 'absent')}
                        className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                          rec.status === 'absent'
                            ? 'bg-dustyrose-500 text-white shadow-xs'
                            : 'bg-ivory-100 hover:bg-dustyrose-50 text-ink-700'
                        }`}
                      >
                        <XCircle size={12} /> Absent
                      </button>
                    </div>

                    {/* Arrival Note / Time Strip */}
                    <div className="p-2.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-xs font-['Outfit'] space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-ink-500 font-semibold">
                        <span>Arrival: <strong className="text-ink-900 font-mono">{rec.arrivalTime}</strong></span>
                        <button
                          onClick={() => openEditModal(c.id, activeTab)}
                          className="text-[#0B4E49] hover:underline font-bold font-['Quicksand'] flex items-center gap-1"
                        >
                          <Edit3 size={11} /> {activeTab === 'arrival' ? 'Edit Note' : 'Pickup'}
                        </button>
                      </div>

                      {activeTab === 'arrival' ? (
                        <p className="text-[11px] text-ink-700 italic truncate">
                          {rec.arrivalNote || 'No morning note'}
                        </p>
                      ) : (
                        <div className="text-[11px] text-ink-700 flex items-center justify-between">
                          <span>{rec.isPickedUp ? `✓ ${rec.pickedUpBy}` : 'In class'}</span>
                          {rec.isPickedUp && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                              ✓ Authorized
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="bg-white p-3 rounded-3xl border border-ivory-300 shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredChildren.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 30]}
              itemLabel="children"
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL: Morning Arrival & Health Note */}
      {editingChildId && editingRecord && modalType === 'arrival' && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-ink-900 font-['Quicksand']">
                  Morning Arrival &amp; Health Note
                </h3>
                <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
                  Child: <strong className="text-ink-800">{editingRecord.name}</strong> ({editingRecord.classroom})
                </p>
              </div>
              <button
                onClick={() => setEditingChildId(null)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as any;
                handleModalSave({
                  arrivalTime: target.arrivalTime.value,
                  arrivalNote: target.arrivalNote.value,
                });
              }}
              className="space-y-3.5 text-xs font-['Outfit']"
            >
              <div>
                <label className="block font-bold text-ink-700 mb-1">Arrival Time</label>
                <input
                  name="arrivalTime"
                  type="text"
                  defaultValue={editingRecord.arrivalTime === '--:--' ? '08:45 AM' : editingRecord.arrivalTime}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] font-mono font-bold"
                  required
                />
              </div>

              {/* Quick Preset Note Buttons */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Quick Note Tags (Tap to add)</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Arrived cheerful 🎈',
                    'Brought extra clothes 👕',
                    'Parent pickup at 2:00 PM ⏰',
                    'Administered morning vitamin 🍎',
                    'Mild cough, monitor 🩺',
                    'Resting with parent permission 🏡',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const noteInput = document.getElementById('modalArrivalNote') as HTMLTextAreaElement;
                        if (noteInput) {
                          noteInput.value = noteInput.value ? `${noteInput.value} • ${preset}` : preset;
                        }
                      }}
                      className="px-2.5 py-1 rounded-xl bg-ivory-100 hover:bg-[#E0F7F4] text-ink-700 hover:text-[#0B4E49] text-[11px] font-medium border border-ivory-200 transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Morning Handover &amp; Health Note</label>
                <textarea
                  id="modalArrivalNote"
                  name="arrivalNote"
                  rows={3}
                  defaultValue={editingRecord.arrivalNote}
                  placeholder="e.g. Arrived cheerful, brought spare jacket for afternoon playground time..."
                  className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200 font-['Quicksand']">
                <button
                  type="button"
                  onClick={() => setEditingChildId(null)}
                  className="px-4 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white font-bold transition shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: Afternoon Departure & Authorized Pickup */}
      {editingChildId && editingRecord && modalType === 'departure' && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-ink-900 font-['Quicksand']">
                  Log Child Departure &amp; Authorized Pickup
                </h3>
                <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
                  Child: <strong className="text-ink-800">{editingRecord.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingChildId(null)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

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
              className="space-y-3 text-xs font-['Outfit']"
            >
              {/* Approved Pickups 1-Tap Select */}
              <div className="p-3 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] space-y-2">
                <span className="text-[11px] font-bold text-[#0B4E49] flex items-center gap-1 font-['Quicksand']">
                  <ShieldCheck size={14} className="text-[#21B8AF]" /> Approved Authorized Pickups:
                </span>
                <div className="space-y-1">
                  {editingRecord.authorizedList.map((auth, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const nameInput = document.getElementById('modalPickedUpBy') as HTMLInputElement;
                        const relInput = document.getElementById('modalRelationship') as HTMLInputElement;
                        if (nameInput) nameInput.value = auth.name;
                        if (relInput) relInput.value = auth.relationship;
                      }}
                      className="w-full flex items-center justify-between p-2 bg-white hover:bg-emerald-50/50 rounded-xl border border-[#C3EFEB] text-xs transition text-left"
                    >
                      <span className="font-bold text-ink-900">
                        {auth.name} <span className="text-ink-500 font-normal">({auth.relationship})</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Select Approved
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Departure Time</label>
                  <input
                    name="departureTime"
                    type="text"
                    defaultValue={editingRecord.departureTime === '--:--' ? '03:30 PM' : editingRecord.departureTime}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Released By Staff</label>
                  <input
                    name="releasedByStaff"
                    type="text"
                    defaultValue={editingRecord.releasedByStaff || 'Teacher Helen Brooks'}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Picked Up By (Adult)</label>
                  <input
                    id="modalPickedUpBy"
                    name="pickedUpBy"
                    type="text"
                    defaultValue={editingRecord.pickedUpBy || editingRecord.authorizedList[0]?.name || ''}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Relationship to Child</label>
                  <input
                    id="modalRelationship"
                    name="pickedUpRelationship"
                    type="text"
                    defaultValue={editingRecord.pickedUpRelationship || editingRecord.authorizedList[0]?.relationship || 'Mother'}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Departure Handover Note</label>
                <textarea
                  name="departureNote"
                  rows={2}
                  defaultValue={editingRecord.departureNote}
                  placeholder="e.g. Sent home with daily artwork and sweater"
                  className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200 font-['Quicksand']">
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
          </div>
        </div>
      )}
    </div>
  );
};
