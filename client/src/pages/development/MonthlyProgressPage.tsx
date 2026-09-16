import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  Save,
  ChevronRight,
  ChevronLeft,
  Eye,
  X,
  Award,
  Heart,
  Smile,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api.js';

interface SkillItem {
  name: string;
  status: 'Emerging' | 'Developing' | 'Achieved';
}

interface DomainProgress {
  area: string;
  shortName: string;
  icon: string;
  theme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  status: 'Emerging' | 'Developing' | 'Achieved';
  skills: SkillItem[];
  note: string;
}

interface MonthlyReport {
  childId: string;
  childName: string;
  classroom: string;
  age: string;
  month: string;
  attendanceSummary: { present: number; absent: number; late: number };
  domains: DomainProgress[];
  teacherSummary: string;
  highlights: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  teacherName: string;
}

const DEFAULT_DOMAINS: DomainProgress[] = [
  {
    area: 'Cognitive & Thinking',
    shortName: 'Thinking',
    icon: '🧩',
    theme: { bg: 'bg-blue-50/60', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
    status: 'Achieved',
    skills: [
      { name: 'Explores cause and effect with materials', status: 'Achieved' },
      { name: 'Sorts objects by color, shape, and size', status: 'Achieved' },
      { name: 'Counts objects with 1-to-1 correspondence', status: 'Developing' },
      { name: 'Solves simple floor puzzles with focus', status: 'Achieved' },
    ],
    note: 'Eager problem-solver; loves math counters and pattern blocks.',
  },
  {
    area: 'Language & Speech',
    shortName: 'Speech',
    icon: '🗣️',
    theme: { bg: 'bg-purple-50/60', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800' },
    status: 'Developing',
    skills: [
      { name: 'Expresses needs, feelings, and ideas clearly', status: 'Achieved' },
      { name: 'Listens attentively during group story circle', status: 'Developing' },
      { name: 'Follows 2-to-3 step verbal instructions', status: 'Developing' },
      { name: 'Asks descriptive questions and shares thoughts', status: 'Achieved' },
    ],
    note: 'Expanding vocabulary rapidly in both English and home language.',
  },
  {
    area: 'Social & Emotional',
    shortName: 'Feelings & Friends',
    icon: '💛',
    theme: { bg: 'bg-amber-50/60', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    status: 'Achieved',
    skills: [
      { name: 'Shares toys and takes turns with peers', status: 'Achieved' },
      { name: 'Shows empathy toward peers when they are upset', status: 'Achieved' },
      { name: 'Transitions smoothly between classroom routines', status: 'Achieved' },
      { name: 'Engages in joyful cooperative group play', status: 'Developing' },
    ],
    note: 'Very kind peer; welcomed new classmates warmly.',
  },
  {
    area: 'Physical & Movement',
    shortName: 'Movement',
    icon: '🏃',
    theme: { bg: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
    status: 'Developing',
    skills: [
      { name: 'Gross motor: Jumps, balances, runs safely outdoors', status: 'Achieved' },
      { name: 'Fine motor: Uses child safety scissors along lines', status: 'Developing' },
      { name: 'Pencil grip: Holds crayons with developing tripod grasp', status: 'Developing' },
      { name: 'Self-help: Zips jacket and manages water bottle', status: 'Achieved' },
    ],
    note: 'Excellent physical coordination during outdoor playground play.',
  },
  {
    area: 'Creative & Art',
    shortName: 'Creativity',
    icon: '🎨',
    theme: { bg: 'bg-pink-50/60', border: 'border-pink-200', text: 'text-pink-900', badge: 'bg-pink-100 text-pink-800' },
    status: 'Achieved',
    skills: [
      { name: 'Explores textures, colors, and clay freely', status: 'Achieved' },
      { name: 'Participates joyfully in music and movement songs', status: 'Achieved' },
      { name: 'Engages in imaginative pretend role-play', status: 'Achieved' },
    ],
    note: 'Loves the sensory paint station; created beautiful watercolor pieces.',
  },
  {
    area: 'Early Literacy & Reading',
    shortName: 'Reading',
    icon: '📖',
    theme: { bg: 'bg-cyan-50/60', border: 'border-cyan-200', text: 'text-cyan-900', badge: 'bg-cyan-100 text-cyan-800' },
    status: 'Developing',
    skills: [
      { name: 'Recognizes own printed name on cubby & art', status: 'Achieved' },
      { name: 'Demonstrates proper book handling & page turning', status: 'Achieved' },
      { name: 'Identifies common initial phonetic sounds', status: 'Developing' },
      { name: 'Retells simple sequence of read-aloud stories', status: 'Developing' },
    ],
    note: 'Loves browsing picture books in the cozy reading nook.',
  },
];

const DOMAIN_NOTE_SUGGESTIONS: Record<string, string[]> = {
  'Cognitive & Thinking': [
    'Curious and enthusiastic problem-solver.',
    'Quickly grasps color and pattern sorting.',
    'Shows wonderful focus during building activities.',
  ],
  'Language & Speech': [
    'Speaks in clear, expressive sentences.',
    'Loves participating in circle storytime.',
    'Listens attentively and asks thoughtful questions.',
  ],
  'Social & Emotional': [
    'Very gentle and considerate with friends.',
    'Takes turns and shares toys happily.',
    'Comfortable and calm during classroom transitions.',
  ],
  'Physical & Movement': [
    'Agile, joyful runner and climber outdoors.',
    'Fine motor scissor control is progressing well.',
    'Proud of putting on own jacket and shoes.',
  ],
  'Creative & Art': [
    'Deeply engaged in sensory watercolor painting.',
    'Loves singing along with rhythm instruments.',
    'Imaginative pretend play with dramatic costumes.',
  ],
  'Early Literacy & Reading': [
    'Proudly recognizes own printed name.',
    'Enjoys quiet time browsing picture books.',
    'Points to letter sounds with growing confidence.',
  ],
};

const CLASSROOMS = [
  { id: 'Sunshine Classroom (KG 1)', name: 'Sunshine (KG1)', icon: '☀️' },
  { id: 'Rainbow Classroom (Nursery)', name: 'Rainbow (Nursery)', icon: '🌈' },
  { id: 'Butterfly Room (Toddlers)', name: 'Butterfly (Toddlers)', icon: '🦋' },
  { id: 'Little Explorers (KG 2)', name: 'Little Explorers (KG2)', icon: '🔍' },
];

interface MonthlyProgressPageProps {
  onNavigate?: (path: string) => void;
}

export const MonthlyProgressPage: React.FC<MonthlyProgressPageProps> = ({ onNavigate }) => {
  const [children, setChildren] = useState<any[]>([]);
  const [reports, setReports] = useState<Record<string, MonthlyReport>>({});
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('Sunshine Classroom (KG 1)');
  const [activeDomainTab, setActiveDomainTab] = useState<number>(0); // 0 to 5 for focused domain
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    loadChildrenData();
  }, []);

  const loadChildrenData = async () => {
    setLoading(true);
    const res = await api.getChildren();
    setLoading(false);
    if (res.success && res.data) {
      setChildren(res.data);
      if (res.data.length > 0) {
        setSelectedChildId(res.data[0].id);

        const initialReports: Record<string, MonthlyReport> = {};
        res.data.forEach((c: any, index: number) => {
          initialReports[c.id] = {
            childId: c.id,
            childName: `${c.first_name} ${c.last_name}`,
            classroom: c.classroom_name || 'Sunshine Classroom (KG 1)',
            age: c.calculated_age?.formatted || '4 yrs',
            month: 'September 2026',
            attendanceSummary: {
              present: index === 3 ? 18 : 21,
              absent: index === 3 ? 3 : 1,
              late: index === 5 ? 2 : 0,
            },
            domains: JSON.parse(JSON.stringify(DEFAULT_DOMAINS)),
            teacherSummary: `${c.first_name} has had a joyful, flourishing month! They approach classroom activities with bright curiosity, listen attentively during story circles, and show heartwarming empathy to friends during playtime.`,
            highlights: `Proudly completed an intricate bead pattern necklace and taught a classmate the alternating colors; showed kindness helping a friend put on outdoor shoes.`,
            status: index === 0 ? 'published' : 'draft',
            publishedAt: index === 0 ? 'Sep 15, 2026' : undefined,
            teacherName: 'Teacher Helen Brooks',
          };
        });
        setReports(initialReports);
      }
    }
  };

  const activeReport = selectedChildId ? reports[selectedChildId] : null;

  // Filter children by selected classroom
  const sectionChildren = children.filter((c) => {
    if (selectedClassroom.includes('Sunshine')) return c.classroom_name?.includes('Sunshine') || !c.classroom_name;
    if (selectedClassroom.includes('Rainbow')) return c.classroom_name?.includes('Rainbow');
    if (selectedClassroom.includes('Butterfly')) return c.classroom_name?.includes('Butterfly');
    if (selectedClassroom.includes('Little Explorers')) return c.classroom_name?.includes('Little Explorers');
    return true;
  });

  const currentChildIndex = sectionChildren.findIndex((c) => c.id === selectedChildId);

  const handlePrevChild = () => {
    if (currentChildIndex > 0) {
      setSelectedChildId(sectionChildren[currentChildIndex - 1].id);
    }
  };

  const handleNextChild = () => {
    if (currentChildIndex < sectionChildren.length - 1) {
      setSelectedChildId(sectionChildren[currentChildIndex + 1].id);
    }
  };

  const updateSkillStatus = (
    domainIndex: number,
    skillIndex: number,
    status: 'Emerging' | 'Developing' | 'Achieved'
  ) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].domains[domainIndex].skills[skillIndex].status = status;

    // Recalculate overall domain status automatically
    const skills = updated[selectedChildId].domains[domainIndex].skills;
    const achievedCount = skills.filter((s) => s.status === 'Achieved').length;
    const emergingCount = skills.filter((s) => s.status === 'Emerging').length;
    if (achievedCount >= 3) {
      updated[selectedChildId].domains[domainIndex].status = 'Achieved';
    } else if (emergingCount >= 3) {
      updated[selectedChildId].domains[domainIndex].status = 'Emerging';
    } else {
      updated[selectedChildId].domains[domainIndex].status = 'Developing';
    }

    setReports(updated);
  };

  const updateDomainNote = (domainIndex: number, note: string) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].domains[domainIndex].note = note;
    setReports(updated);
  };

  const appendDomainNote = (domainIndex: number, text: string) => {
    if (!activeReport) return;
    const currentNote = activeReport.domains[domainIndex].note;
    const newNote = currentNote ? `${currentNote} ${text}` : text;
    updateDomainNote(domainIndex, newNote);
  };

  const updateTeacherSummary = (text: string) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].teacherSummary = text;
    setReports(updated);
  };

  const updateHighlights = (text: string) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].highlights = text;
    setReports(updated);
  };

  const handleSaveDraft = () => {
    showToast('Draft progress review saved.');
  };

  const handlePublish = () => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].status = 'published';
    updated[selectedChildId].publishedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setReports(updated);
    showToast('Report published! Parents can now view this in their portal.');
  };

  // Calculate stats
  const calculateStats = () => {
    if (!activeReport) return { achieved: 0, total: 0, percentage: 0 };
    let total = 0;
    let achieved = 0;
    activeReport.domains.forEach((d) => {
      d.skills.forEach((s) => {
        total++;
        if (s.status === 'Achieved') achieved++;
      });
    });
    const percentage = total > 0 ? Math.round((achieved / total) * 100) : 0;
    return { achieved, total, percentage };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-ink-500 font-sans">
        <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-[#20BDB2] to-[#38D3C7] text-white flex items-center justify-center mx-auto mb-3 animate-pulse shadow-md text-xl">
          🌱
        </div>
        <p className="font-bold text-[#0B4E49] font-['Quicksand']">Loading Development Sections...</p>
      </div>
    );
  }

  const currentDomain = activeReport ? activeReport.domains[activeDomainTab] : null;

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-14 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold font-['Outfit']">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Friendly Top Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-ivory-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 font-['Quicksand']">
              Child Development &amp; Monthly Review
            </h2>
          </div>
          <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
            A simple, warm way to observe and share early childhood milestones across 6 core areas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end font-['Quicksand']">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-ivory-100 text-ink-800 text-xs font-bold transition border border-ivory-300 shadow-2xs flex items-center gap-1.5"
          >
            <Eye size={14} className="text-[#21B8AF]" />
            <span>Preview Parent Report</span>
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-2xl bg-ivory-100 hover:bg-ivory-200 text-ink-800 text-xs font-bold transition border border-ivory-200"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition flex items-center gap-1.5"
          >
            <Send size={13} />
            <span>Publish to Portal</span>
          </button>
        </div>
      </div>

      {/* Classroom Selection & Child Navigator Strip */}
      <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs space-y-3">
        {/* Row 1: Classroom Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-ivory-200">
          <div className="flex flex-wrap items-center gap-1.5 font-['Quicksand']">
            <span className="text-xs font-bold text-ink-500 mr-1">Classroom:</span>
            {CLASSROOMS.map((room) => {
              const isSelected = selectedClassroom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedClassroom(room.id);
                    const first = children.find((c) => c.classroom_name === room.id || c.classroom_name?.includes(room.name));
                    if (first) setSelectedChildId(first.id);
                  }}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0B4E49] text-white shadow-2xs'
                      : 'bg-ivory-50 text-ink-700 hover:bg-ivory-100 border border-ivory-200'
                  }`}
                >
                  <span>{room.icon}</span>
                  <span>{room.name}</span>
                </button>
              );
            })}
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-1.5 text-xs text-ink-600 font-['Quicksand']">
            <Calendar size={13} className="text-[#21B8AF]" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="font-bold text-ink-900 bg-transparent focus:outline-none cursor-pointer"
            >
              <option>September 2026</option>
              <option>October 2026</option>
              <option>November 2026</option>
              <option>December 2026</option>
            </select>
          </div>
        </div>

        {/* Row 2: Friendly Child Cycler */}
        {activeReport && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-0.5">
            <div className="flex items-center gap-2 w-full sm:w-auto font-['Outfit']">
              <button
                onClick={handlePrevChild}
                disabled={currentChildIndex <= 0}
                className="p-2 rounded-2xl bg-ivory-100 hover:bg-ivory-200 disabled:opacity-30 disabled:cursor-not-allowed text-ink-700 transition"
                title="Previous Child"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold text-sm flex items-center justify-center border border-[#C3EFEB] font-['Quicksand'] shrink-0">
                  {activeReport.childName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedChildId}
                      onChange={(e) => setSelectedChildId(e.target.value)}
                      className="font-extrabold text-base text-ink-900 bg-transparent focus:outline-none cursor-pointer font-['Quicksand']"
                    >
                      {sectionChildren.map((c, idx) => (
                        <option key={c.id} value={c.id}>
                          {idx + 1}. {c.first_name} {c.last_name} ({c.calculated_age?.formatted || 'Early Years'})
                        </option>
                      ))}
                    </select>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        activeReport.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {activeReport.status === 'published' ? '✓ Published' : '○ Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500">
                    Child {currentChildIndex + 1} of {sectionChildren.length} in this room
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextChild}
                disabled={currentChildIndex >= sectionChildren.length - 1}
                className="p-2 rounded-2xl bg-ivory-100 hover:bg-ivory-200 disabled:opacity-30 disabled:cursor-not-allowed text-ink-700 transition"
                title="Next Child"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Overall Milestones Progress Pill */}
            <div className="flex items-center gap-2 text-xs font-['Outfit'] bg-ivory-50 px-3.5 py-1.5 rounded-2xl border border-ivory-200">
              <span className="text-ink-500 font-medium">Milestones Achieved:</span>
              <span className="font-extrabold text-[#0B4E49]">
                {stats.achieved} of {stats.total} ({stats.percentage}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6 Developmental Domain Section Tabs (Clean & Friendly) */}
      {activeReport && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-['Quicksand']">
          {activeReport.domains.map((dom, index) => {
            const isTabActive = activeDomainTab === index;
            const achievedInDomain = dom.skills.filter((s) => s.status === 'Achieved').length;

            return (
              <button
                key={dom.area}
                onClick={() => setActiveDomainTab(index)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  isTabActive
                    ? 'bg-white border-[#21B8AF] ring-2 ring-[#21B8AF]/30 shadow-xs'
                    : 'bg-white/80 border-ivory-300 hover:border-ivory-400 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{dom.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      achievedInDomain === dom.skills.length
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-ivory-100 text-ink-600'
                    }`}
                  >
                    {achievedInDomain}/{dom.skills.length}
                  </span>
                </div>
                <p className="font-bold text-xs text-ink-900 mt-1.5 truncate">
                  {dom.shortName}
                </p>
                <span className="text-[10px] text-ink-400 block">
                  {dom.status}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Domain Card (Spacious, Clean, Friendly) */}
      {activeReport && currentDomain && (
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-xs space-y-5 font-['Outfit']">
          {/* Header of Active Domain */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-ivory-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentDomain.icon}</span>
              <div>
                <h3 className="text-lg font-extrabold text-ink-900 font-['Quicksand']">
                  {currentDomain.area}
                </h3>
                <p className="text-xs text-ink-500">
                  Tap to update each milestone skill below for {activeReport.childName}
                </p>
              </div>
            </div>

            {/* Overall Domain Status Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-ink-500">Domain Status:</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                  currentDomain.status === 'Achieved'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : currentDomain.status === 'Developing'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {currentDomain.status === 'Achieved' ? '✓ ' : currentDomain.status === 'Developing' ? '◐ ' : '○ '}
                {currentDomain.status}
              </span>
            </div>
          </div>

          {/* Clean Skills List with 3-Option Toggles */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-ink-600 font-['Quicksand'] block">
              Observed Skills &amp; Growth Milestones:
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {currentDomain.skills.map((skill, sIdx) => (
                <div
                  key={skill.name}
                  className="p-3.5 rounded-2xl bg-ivory-50/70 border border-ivory-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-ivory-50 transition"
                >
                  <span className="text-xs font-semibold text-ink-900 leading-snug">
                    {skill.name}
                  </span>

                  {/* 3 Friendly Status Pills */}
                  <div className="flex items-center gap-1.5 font-['Quicksand'] text-[11px] font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => updateSkillStatus(activeDomainTab, sIdx, 'Emerging')}
                      className={`px-3 py-1.5 rounded-xl transition ${
                        skill.status === 'Emerging'
                          ? 'bg-amber-500 text-white shadow-2xs font-extrabold'
                          : 'bg-white hover:bg-amber-50 text-ink-600 border border-ivory-200'
                      }`}
                    >
                      ○ Emerging
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSkillStatus(activeDomainTab, sIdx, 'Developing')}
                      className={`px-3 py-1.5 rounded-xl transition ${
                        skill.status === 'Developing'
                          ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                          : 'bg-white hover:bg-blue-50 text-ink-600 border border-ivory-200'
                      }`}
                    >
                      ◐ Growing
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSkillStatus(activeDomainTab, sIdx, 'Achieved')}
                      className={`px-3 py-1.5 rounded-xl transition ${
                        skill.status === 'Achieved'
                          ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                          : 'bg-white hover:bg-emerald-50 text-ink-600 border border-ivory-200'
                      }`}
                    >
                      ✓ Achieved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher's Note for This Domain */}
          <div className="space-y-2 pt-2 border-t border-ivory-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink-800 font-['Quicksand']">
                Teacher's Observation Note for {currentDomain.shortName}:
              </label>
            </div>

            {/* Quick Suggestions Tags */}
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_NOTE_SUGGESTIONS[currentDomain.area]?.map((suggestion, sIndex) => (
                <button
                  key={sIndex}
                  type="button"
                  onClick={() => appendDomainNote(activeDomainTab, suggestion)}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-ivory-100 hover:bg-[#E0F7F4] text-ink-700 hover:text-[#0B4E49] border border-ivory-200 transition"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={currentDomain.note}
              onChange={(e) => updateDomainNote(activeDomainTab, e.target.value)}
              placeholder={`Write a brief note for ${currentDomain.shortName}...`}
              className="w-full px-4 py-2.5 bg-ivory-50 border border-ivory-300 rounded-2xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
            />
          </div>

          {/* Section Navigation footer: Prev Section | Next Section */}
          <div className="flex items-center justify-between pt-3 border-t border-ivory-200 text-xs font-['Quicksand'] font-bold">
            <button
              type="button"
              disabled={activeDomainTab === 0}
              onClick={() => setActiveDomainTab((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory-100 hover:bg-ivory-200 disabled:opacity-30 text-ink-700 transition"
            >
              <ChevronLeft size={14} />
              <span>Previous Section</span>
            </button>
            <span className="text-ink-400 font-normal">
              Section {activeDomainTab + 1} of 6
            </span>
            <button
              type="button"
              disabled={activeDomainTab === 5}
              onClick={() => setActiveDomainTab((prev) => Math.min(5, prev + 1))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white disabled:opacity-30 hover:from-[#1BA49A] hover:to-[#29BCB1] transition shadow-2xs"
            >
              <span>Next Section</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Two Clean Narrative Summary Cards */}
      {activeReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-['Outfit']">
          {/* Educator Overall Summary */}
          <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-2">
            <h4 className="font-extrabold text-xs text-ink-900 font-['Quicksand'] flex items-center gap-1.5">
              <span>📝</span>
              <span>Lead Educator Monthly Narrative</span>
            </h4>
            <textarea
              rows={3}
              value={activeReport.teacherSummary}
              onChange={(e) => updateTeacherSummary(e.target.value)}
              placeholder="Overall positive summary of this month's growth..."
              className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-2xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] leading-relaxed"
            />
          </div>

          {/* Classroom Joyful Moments */}
          <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-2">
            <h4 className="font-extrabold text-xs text-[#0B4E49] font-['Quicksand'] flex items-center gap-1.5">
              <span>🌟</span>
              <span>Classroom Highlights &amp; Joyful Moments</span>
            </h4>
            <textarea
              rows={3}
              value={activeReport.highlights}
              onChange={(e) => updateHighlights(e.target.value)}
              placeholder="Favorite moments, shared giggles, creative discoveries..."
              className="w-full p-3 bg-[#F0FBF9] border border-[#C3EFEB] rounded-2xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Printable Report Card Modal Preview */}
      {showPreviewModal && activeReport && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-ivory-300 overflow-hidden my-8">
            {/* Modal Controls */}
            <div className="bg-ivory-100 px-6 py-3 border-b border-ivory-200 flex items-center justify-between font-['Quicksand']">
              <span className="text-xs font-bold text-ink-700">
                Parent Report Card Preview (1–2 Pages)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-ivory-300 rounded-xl text-xs font-bold text-ink-800 hover:bg-ivory-50 flex items-center gap-1.5 transition"
                >
                  <Printer size={13} /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Report Content */}
            <div className="p-8 space-y-6 text-ink-900 print:p-0 font-['Outfit']">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#21B8AF] pb-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                  <div>
                    <h1 className="text-xl font-black text-[#4B4039] font-['Quicksand']">
                      Bubbles Early Years School
                    </h1>
                    <p className="text-xs font-bold text-[#21B8AF] font-['Quicksand']">
                      Monthly Development &amp; Progress Report
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-ink-900 font-['Quicksand']">{selectedMonth}</p>
                  <p className="text-[11px] text-ink-500 font-medium">Published: {activeReport.publishedAt || 'Draft'}</p>
                </div>
              </div>

              {/* Child Info Banner */}
              <div className="bg-[#F0FBF9] p-4 rounded-2xl border border-[#C3EFEB] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-ink-500 font-medium">Child Name</span>
                  <p className="font-extrabold text-ink-900 text-sm mt-0.5 font-['Quicksand']">{activeReport.childName}</p>
                </div>
                <div>
                  <span className="text-ink-500 font-medium">Classroom</span>
                  <p className="font-bold text-ink-900 mt-0.5">{activeReport.classroom}</p>
                </div>
                <div>
                  <span className="text-ink-500 font-medium">Age Group</span>
                  <p className="font-bold text-ink-900 mt-0.5">{activeReport.age}</p>
                </div>
                <div>
                  <span className="text-ink-500 font-medium">Monthly Attendance</span>
                  <p className="font-bold text-emerald-800 mt-0.5">
                    {activeReport.attendanceSummary.present} Present / {activeReport.attendanceSummary.absent} Absent
                  </p>
                </div>
              </div>

              {/* Domains Grid */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-ink-800 mb-3 font-['Quicksand']">
                  Early Years Developmental Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeReport.domains.map((dom) => (
                    <div
                      key={dom.area}
                      className="p-3.5 rounded-2xl border border-ivory-200 bg-ivory-50/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-ink-900 font-['Quicksand'] flex items-center gap-1">
                          <span>{dom.icon}</span> {dom.area}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            dom.status === 'Achieved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : dom.status === 'Developing'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {dom.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-600 italic leading-relaxed">
                        "{dom.note}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Summary & Highlights */}
              <div className="space-y-3 pt-2 border-t border-ivory-200">
                <div>
                  <h4 className="text-xs font-bold text-ink-900 mb-1 font-['Quicksand']">Teacher Summary</h4>
                  <p className="text-xs text-ink-700 leading-relaxed bg-ivory-50 p-3 rounded-2xl border border-ivory-200">
                    {activeReport.teacherSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-ink-900 mb-1 font-['Quicksand']">Classroom Highlights &amp; Joyful Moments</h4>
                  <p className="text-xs text-ink-700 leading-relaxed bg-[#F0FBF9] p-3 rounded-2xl border border-[#C3EFEB]">
                    🌟 {activeReport.highlights}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-ivory-200 flex items-center justify-between text-xs text-ink-600">
                <div>
                  <p className="font-bold text-ink-900">{activeReport.teacherName}</p>
                  <p className="text-[10px] text-ink-500">Lead Early Childhood Educator</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink-900">Parent Growth Partnership</p>
                  <p className="text-[10px] text-ink-500">Bubbles Early Years School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
