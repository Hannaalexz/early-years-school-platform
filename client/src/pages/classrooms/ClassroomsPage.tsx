import React, { useState, useEffect } from 'react';
import {
  DoorOpen,
  Users,
  Baby,
  Sparkles,
  Calendar,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Palette,
  HeartHandshake,
  CheckCircle2,
  X,
  Eye,
  BookOpen
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';
import { Modal } from '../../components/common/Modal.js';
import { Input, Select } from '../../components/common/Input.js';
import { Pagination } from '../../components/common/Pagination.js';
import { api } from '../../services/api.js';

interface ClassroomDetail {
  id: string;
  name: string;
  room_number: string;
  capacity: number;
  enrolled: number;
  presentToday: number;
  absentToday: number;
  program_name: string;
  age_range: string;
  lead_teacher: string;
  assistant_teacher: string;
  ratio: string;
  theme_color: string;
  icon: string;
  zones: string[];
}

interface ClassroomsPageProps {
  onNavigate: (path: string) => void;
  onSelectChild: (childId: string) => void;
}

export const ClassroomsPage: React.FC<ClassroomsPageProps> = ({ onNavigate, onSelectChild }) => {
  const [classrooms, setClassrooms] = useState<ClassroomDetail[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');

  // Roster Modal state
  const [rosterClassroom, setRosterClassroom] = useState<ClassroomDetail | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterPage, setRosterPage] = useState(1);
  const [rosterPageSize, setRosterPageSize] = useState(6);

  // Add Classroom Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    room_number: '',
    capacity: 15,
    program_name: 'Preschool (KG 1)',
    lead_teacher: 'Teacher Martha',
    assistant_teacher: 'Aide Sarah',
    age_range: '3–4 Years',
    color_accent: '#FEF3C7',
  });

  useEffect(() => {
    loadClassroomsAndChildren();
  }, []);

  const loadClassroomsAndChildren = async () => {
    setLoading(true);
    const [classroomsRes, childrenRes] = await Promise.all([
      api.getClassrooms(),
      api.getChildren(),
    ]);
    setLoading(false);

    const childrenData = childrenRes.success && childrenRes.data ? childrenRes.data : [];
    setChildren(childrenData);

    // Build rich early years classroom models
    const defaultRooms: ClassroomDetail[] = [
      {
        id: 'c1',
        name: 'Sunshine Classroom',
        room_number: 'Room A-101',
        capacity: 18,
        enrolled: childrenData.filter((c: any) => c.classroom_name?.includes('Sunshine') || !c.classroom_name).length || 18,
        presentToday: 17,
        absentToday: 1,
        program_name: 'Preschool (KG 1)',
        age_range: '3–4 Years',
        lead_teacher: 'Teacher Helen Brooks',
        assistant_teacher: 'Aide Sara Kidane',
        ratio: '1:9 Ratio',
        theme_color: '#F59E0B',
        icon: '☀️',
        zones: ['Reading Nook', 'Color & Easel Studio', 'Building Blocks', 'Sensory Play'],
      },
      {
        id: 'c2',
        name: 'Rainbow Classroom',
        room_number: 'Room A-102',
        capacity: 16,
        enrolled: 14,
        presentToday: 13,
        absentToday: 1,
        program_name: 'Nursery Playgroup',
        age_range: '2–3 Years',
        lead_teacher: 'Teacher Sarah Miller',
        assistant_teacher: 'Aide Fatima Ali',
        ratio: '1:7 Ratio',
        theme_color: '#8B5CF6',
        icon: '🌈',
        zones: ['Cooperative Circle', 'Water Table', 'Soft Climbers', 'Pretend Kitchen'],
      },
      {
        id: 'c3',
        name: 'Butterfly Room',
        room_number: 'Room B-101',
        capacity: 12,
        enrolled: 10,
        presentToday: 9,
        absentToday: 1,
        program_name: 'Toddler Playgroup',
        age_range: '1–2 Years',
        lead_teacher: 'Teacher Michael Scott',
        assistant_teacher: 'Aide Betty Haile',
        ratio: '1:5 Ratio',
        theme_color: '#EC4899',
        icon: '🦋',
        zones: ['Sensory Texture Wall', 'Crawling Maze', 'Mirror Play', 'Quiet Corner'],
      },
      {
        id: 'c4',
        name: 'Little Explorers',
        room_number: 'Room A-201',
        capacity: 20,
        enrolled: 16,
        presentToday: 15,
        absentToday: 1,
        program_name: 'Kindergarten (KG 2)',
        age_range: '4–5 Years',
        lead_teacher: 'Teacher Bethany Wood',
        assistant_teacher: 'Aide Dawit Bekele',
        ratio: '1:10 Ratio',
        theme_color: '#10B981',
        icon: '🔍',
        zones: ['Early Phonics Center', 'Math Manipulatives', 'Science & Nature', 'Writers Corner'],
      },
    ];

    setClassrooms(defaultRooms);
  };

  // Filter classrooms
  const filteredClassrooms = classrooms.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lead_teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram =
      selectedProgram === 'all' ||
      c.program_name.toLowerCase().includes(selectedProgram.toLowerCase());
    return matchesSearch && matchesProgram;
  });

  // Calculate totals
  const totalEnrolled = classrooms.reduce((acc, c) => acc + c.enrolled, 0);
  const totalCapacity = classrooms.reduce((acc, c) => acc + c.capacity, 0);
  const totalPresent = classrooms.reduce((acc, c) => acc + c.presentToday, 0);

  // Get enrolled children for roster modal
  const classroomRosterChildren = rosterClassroom
    ? children.filter((child) => {
        const matchesRoom =
          child.classroom_name === rosterClassroom.name ||
          (rosterClassroom.name.includes('Sunshine') && !child.classroom_name);
        const matchesSearch =
          `${child.first_name} ${child.last_name}`
            .toLowerCase()
            .includes(rosterSearch.toLowerCase());
        return matchesRoom && matchesSearch;
      })
    : [];

  const paginatedRoster = classroomRosterChildren.slice(
    (rosterPage - 1) * rosterPageSize,
    rosterPage * rosterPageSize
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 font-sans">
      {/* Friendly Hero Banner */}
      <div className="bg-gradient-to-r from-[#20BDB2] via-[#2BCBC0] to-[#38D3C7] rounded-3xl p-5 sm:p-6 text-white shadow-sm shadow-[#21B8AF]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2 border border-white/30 backdrop-blur">
            <span>🏫</span>
            <span className="font-['Quicksand']">Early Years Environments</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-['Quicksand'] leading-snug">
            Classrooms & Learning Spaces 🎈
          </h2>
          <p className="text-white/95 text-xs mt-1 font-medium font-['Outfit']">
            {classrooms.length} interactive rooms • {totalEnrolled} children enrolled ({totalCapacity} max capacity) • Low student-educator ratios for emotional safety.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/attendance')}
            className="px-3.5 py-2 rounded-2xl bg-white text-[#0B4E49] text-xs font-bold shadow-xs hover:bg-[#F0FBF9] transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Calendar size={14} className="text-[#21B8AF]" />
            <span>Classroom Roll Call</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#0B4E49]/30 hover:bg-[#0B4E49]/40 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 font-['Quicksand']"
          >
            <Plus size={14} />
            <span>New Classroom</span>
          </button>
        </div>
      </div>

      {/* 4 Focused Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-3xl bg-white border border-[#EFE9DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-600 font-['Outfit']">Active Rooms</span>
            <span className="w-7 h-7 rounded-xl bg-[#E0F7F4] text-[#0B4E49] flex items-center justify-center text-xs">
              <DoorOpen size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-[#3D3530] font-['Quicksand'] mt-1">{classrooms.length} Classrooms</p>
          <p className="text-[11px] text-[#21B8AF] font-medium mt-0.5">Ages 1 to 6 Years</p>
        </div>

        <div className="p-3.5 rounded-3xl bg-white border border-[#EFE9DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-600 font-['Outfit']">Total Enrolled</span>
            <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xs">
              <Baby size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-[#3D3530] font-['Quicksand'] mt-1">{totalEnrolled} Children</p>
          <p className="text-[11px] text-ink-500 font-medium mt-0.5">{totalCapacity - totalEnrolled} spots available</p>
        </div>

        <div className="p-3.5 rounded-3xl bg-white border border-[#EFE9DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-600 font-['Outfit']">Present Today</span>
            <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs">
              <UserCheck size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-700 font-['Quicksand'] mt-1">{totalPresent} Little Ones</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {((totalPresent / Math.max(totalEnrolled, 1)) * 100).toFixed(1)}% attendance rate
          </p>
        </div>

        <div className="p-3.5 rounded-3xl bg-white border border-[#EFE9DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-600 font-['Outfit']">Campus Capacity</span>
            <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xs">
              <HeartHandshake size={16} />
            </span>
          </div>
          <p className="text-xl font-bold text-[#3D3530] font-['Quicksand'] mt-1">{totalCapacity} Maximum</p>
          <p className="text-[11px] text-ink-500 font-medium mt-0.5">
            {((totalEnrolled / Math.max(totalCapacity, 1)) * 100).toFixed(0)}% campus occupancy
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-white border border-[#EFE9DF] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search by room name, teacher, room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#EFE9DF] bg-[#FBF9F5] text-xs text-ink-800 placeholder-ink-400 focus:outline-none focus:border-[#21B8AF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-ink-500 font-medium whitespace-nowrap">Program:</span>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#EFE9DF] bg-[#FBF9F5] text-xs text-ink-700 font-medium focus:outline-none focus:border-[#21B8AF] cursor-pointer"
          >
            <option value="all">All Programs</option>
            <option value="toddler">Toddlers (1–2 Yrs)</option>
            <option value="nursery">Nursery (2–3 Yrs)</option>
            <option value="preschool">Preschool KG1 (3–4 Yrs)</option>
            <option value="kindergarten">Kindergarten KG2 (4–5 Yrs)</option>
          </select>
        </div>
      </div>

      {/* Classrooms Grid (2 Columns on Medium, Balanced Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClassrooms.map((room) => {
          const fillPercentage = Math.round((room.enrolled / room.capacity) * 100);
          const isFull = room.enrolled >= room.capacity;

          return (
            <div
              key={room.id}
              className="rounded-3xl bg-white border border-[#EFE9DF] shadow-2xs hover:shadow-xs hover:border-[#C3EFEB] transition-all p-5 flex flex-col justify-between space-y-4"
            >
              {/* Top Room Banner */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      {room.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#3D3530] font-['Quicksand']">
                          {room.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EFE9DF] text-ink-600 font-mono">
                          {room.room_number}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#21B8AF] font-semibold mt-0.5">
                        {room.program_name} • {room.age_range}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isFull
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isFull ? 'Full Room' : `${room.capacity - room.enrolled} spots open`}
                  </span>
                </div>

                {/* Educator Pair & Ratio */}
                <div className="mt-3.5 p-3 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] text-xs space-y-1.5 font-['Outfit']">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-500">Lead Educator:</span>
                    <strong className="text-[#3D3530] font-bold">{room.lead_teacher}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-500">Assistant Educator:</span>
                    <span className="text-ink-700 font-semibold">{room.assistant_teacher}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#EFE9DF]">
                    <span className="text-ink-500">Care Ratio:</span>
                    <span className="font-bold text-[#0B4E49] bg-[#E0F7F4] px-2 py-0.5 rounded-md">
                      {room.ratio}
                    </span>
                  </div>
                </div>

                {/* Capacity & Attendance Fill Meter */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-600 font-medium">Capacity Fill</span>
                    <span className="font-bold text-[#3D3530] font-['Outfit']">
                      {room.enrolled} / {room.capacity} Enrolled ({fillPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EFE9DF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] transition-all duration-500"
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-ink-500 font-['Outfit'] pt-0.5">
                    <span className="text-emerald-700 font-semibold">
                      ☀️ {room.presentToday} Present Today
                    </span>
                    <span className="text-ink-400">
                      {room.absentToday} Resting / Sick Notice
                    </span>
                  </div>
                </div>

                {/* Classroom Learning Centers */}
                <div className="mt-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-1.5">
                    Room Centers & Discovery Areas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {room.zones.map((zone, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-[#FAF8F5] border border-[#EFE9DF] text-[10px] text-ink-600 font-medium"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setRosterClassroom(room);
                    setRosterPage(1);
                  }}
                  className="flex-1 py-2 px-3 rounded-2xl bg-white border border-[#EFE9DF] hover:border-[#21B8AF] hover:bg-[#F0FBF9] text-xs font-bold text-[#0B4E49] transition shadow-2xs flex items-center justify-center gap-1.5 font-['Quicksand']"
                >
                  <Users size={13} className="text-[#21B8AF]" />
                  <span>Roster ({room.enrolled})</span>
                </button>

                <button
                  onClick={() => onNavigate('/attendance')}
                  className="py-2 px-3 rounded-2xl bg-white border border-[#EFE9DF] hover:border-[#21B8AF] hover:bg-[#F0FBF9] text-xs font-bold text-ink-700 transition shadow-2xs flex items-center justify-center gap-1 font-['Quicksand']"
                  title="Take Attendance for this Room"
                >
                  <Calendar size={13} className="text-amber-500" />
                  <span>Roll Call</span>
                </button>

                <button
                  onClick={() => onNavigate('/activities')}
                  className="py-2 px-3 rounded-2xl bg-white border border-[#EFE9DF] hover:border-[#21B8AF] hover:bg-[#F0FBF9] text-xs font-bold text-ink-700 transition shadow-2xs flex items-center justify-center gap-1 font-['Quicksand']"
                  title="Classroom Play Activities"
                >
                  <Palette size={13} className="text-[#20BDB2]" />
                  <span>Activities</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classroom Enrolled Children Roster Modal (With Integrated Pagination!) */}
      {rosterClassroom && (
        <Modal
          isOpen={!!rosterClassroom}
          onClose={() => setRosterClassroom(null)}
          title={`${rosterClassroom.icon} ${rosterClassroom.name} — Student Roster`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {/* Modal Header details */}
            <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-[#0B4E49] font-['Quicksand'] text-sm">
                  {rosterClassroom.program_name} ({rosterClassroom.age_range})
                </p>
                <p className="text-ink-600 font-['Outfit'] mt-0.5">
                  Lead Teacher: <strong className="text-[#3D3530]">{rosterClassroom.lead_teacher}</strong> • Room: {rosterClassroom.room_number}
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#0B4E49] bg-white px-3 py-1 rounded-xl border border-[#C3EFEB] shadow-2xs">
                {classroomRosterChildren.length} Children Enrolled
              </span>
            </div>

            {/* Roster Search input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search child by name in this classroom..."
                value={rosterSearch}
                onChange={(e) => {
                  setRosterSearch(e.target.value);
                  setRosterPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#EFE9DF] bg-[#FBF9F5] text-xs text-ink-800 placeholder-ink-400 focus:outline-none focus:border-[#21B8AF]"
              />
            </div>

            {/* Children List */}
            {paginatedRoster.length === 0 ? (
              <div className="text-center py-8 text-xs text-ink-500 font-['Outfit']">
                No children found in this classroom roster matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paginatedRoster.map((child: any) => {
                  const hasAllergies = child.allergies && child.allergies.length > 0;
                  const primaryGuardian = child.guardians?.[0];

                  return (
                    <div
                      key={child.id}
                      className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#EFE9DF] hover:border-[#C3EFEB] transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#20BDB2] to-[#38D3C7] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {child.first_name?.[0]}
                          {child.last_name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-[#3D3530] font-['Quicksand'] truncate">
                              {child.first_name} {child.last_name}
                            </h4>
                            {hasAllergies && (
                              <span
                                title={`Allergies: ${child.allergies.join(', ')}`}
                                className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1 rounded"
                              >
                                ⚠️
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink-500 font-mono mt-0.5 truncate">
                            {child.calculated_age?.formatted || 'Ages 3–4'} • {primaryGuardian ? `${primaryGuardian.parent_first_name}` : 'Family file'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setRosterClassroom(null);
                          onSelectChild(child.id);
                        }}
                        className="px-2 py-1 rounded-xl bg-white border border-[#EFE9DF] hover:bg-[#F0FBF9] hover:border-[#21B8AF] text-[#0B4E49] text-[11px] font-bold font-['Quicksand'] shrink-0 flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Profile</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Integrated Pagination inside Roster Modal */}
            <Pagination
              currentPage={rosterPage}
              totalItems={classroomRosterChildren.length}
              pageSize={rosterPageSize}
              onPageChange={setRosterPage}
              onPageSizeChange={setRosterPageSize}
              pageSizeOptions={[6, 12, 18]}
              itemLabel="children"
            />
          </div>
        </Modal>
      )}

      {/* Add Classroom Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Register New Early Years Classroom"
          maxWidth="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newEntry: ClassroomDetail = {
                id: `c_${Date.now()}`,
                name: newRoom.name,
                room_number: newRoom.room_number,
                capacity: Number(newRoom.capacity),
                enrolled: 0,
                presentToday: 0,
                absentToday: 0,
                program_name: newRoom.program_name,
                age_range: newRoom.age_range,
                lead_teacher: newRoom.lead_teacher,
                assistant_teacher: newRoom.assistant_teacher,
                ratio: '1:8 Ratio',
                theme_color: newRoom.color_accent,
                icon: '🎨',
                zones: ['Sensory Table', 'Reading Corner', 'Block Area'],
              };
              setClassrooms((prev) => [...prev, newEntry]);
              setShowAddModal(false);
            }}
            className="space-y-3.5 text-xs font-['Outfit']"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Classroom Name"
                placeholder="e.g. Blossom Room"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                required
              />
              <Input
                label="Room Number / Site"
                placeholder="e.g. Room B-104"
                value={newRoom.room_number}
                onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Educational Program"
                value={newRoom.program_name}
                onChange={(e) => setNewRoom({ ...newRoom, program_name: e.target.value })}
                options={[
                  { value: 'Toddler Playgroup', label: 'Toddlers (1–2 Yrs)' },
                  { value: 'Nursery Playgroup', label: 'Nursery (2–3 Yrs)' },
                  { value: 'Preschool (KG 1)', label: 'Preschool KG1 (3–4 Yrs)' },
                  { value: 'Kindergarten (KG 2)', label: 'Kindergarten KG2 (4–5 Yrs)' },
                ]}
              />
              <Input
                label="Max Student Capacity"
                type="number"
                value={String(newRoom.capacity)}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Lead Educator"
                placeholder="e.g. Teacher Helen"
                value={newRoom.lead_teacher}
                onChange={(e) => setNewRoom({ ...newRoom, lead_teacher: e.target.value })}
                required
              />
              <Input
                label="Assistant Educator"
                placeholder="e.g. Aide Sara"
                value={newRoom.assistant_teacher}
                onChange={(e) => setNewRoom({ ...newRoom, assistant_teacher: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#F0ECE4]">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Create Classroom
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
