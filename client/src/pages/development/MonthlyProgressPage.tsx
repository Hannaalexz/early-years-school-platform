import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  FileText,
  User,
  Filter,
  Save,
  BookOpen,
  Award,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';

interface DomainProgress {
  area: string;
  status: 'Emerging' | 'Developing' | 'Achieved';
  skills: { name: string; status: 'Emerging' | 'Developing' | 'Achieved' }[];
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
    area: 'Cognitive',
    status: 'Achieved',
    skills: [
      { name: 'Explores cause and effect with materials', status: 'Achieved' },
      { name: 'Sorts objects by color, shape, and size', status: 'Achieved' },
      { name: 'Counts objects up to 10 with 1-to-1 correspondence', status: 'Developing' },
      { name: 'Solves simple 6-8 piece floor puzzles', status: 'Achieved' },
    ],
    note: 'Eager problem-solver; loves math counters and pattern blocks.',
  },
  {
    area: 'Language & Communication',
    status: 'Developing',
    skills: [
      { name: 'Expresses needs, feelings, and ideas clearly', status: 'Achieved' },
      { name: 'Listens attentively during group story circle', status: 'Developing' },
      { name: 'Follows 2-to-3 step verbal instructions', status: 'Developing' },
      { name: 'Asks "why" and descriptive questions', status: 'Achieved' },
    ],
    note: 'Expanding vocabulary rapidly in both English and home language.',
  },
  {
    area: 'Social & Emotional',
    status: 'Achieved',
    skills: [
      { name: 'Shares toys and takes turns with peers', status: 'Achieved' },
      { name: 'Shows empathy toward peers when they are upset', status: 'Achieved' },
      { name: 'Transitions smoothly between classroom routines', status: 'Achieved' },
      { name: 'Engages in cooperative group play', status: 'Developing' },
    ],
    note: 'Very kind peer; welcomed new classmates warmly.',
  },
  {
    area: 'Physical',
    status: 'Developing',
    skills: [
      { name: 'Gross motor: Jumps, balances, runs safely outdoors', status: 'Achieved' },
      { name: 'Fine motor: Uses child safety scissors along lines', status: 'Developing' },
      { name: 'Pencil grip: Holds crayons with developing tripod grasp', status: 'Developing' },
      { name: 'Self-help: Zips jacket and manages water bottle', status: 'Achieved' },
    ],
    note: 'Excellent physical coordination during outdoor play.',
  },
  {
    area: 'Creative',
    status: 'Achieved',
    skills: [
      { name: 'Explores textures, colors, and clay freely', status: 'Achieved' },
      { name: 'Participates joyfully in music and movement songs', status: 'Achieved' },
      { name: 'Engages in imaginative pretend role-play', status: 'Achieved' },
    ],
    note: 'Loves the sensory paint station; created beautiful watercolor pieces.',
  },
  {
    area: 'Early Literacy',
    status: 'Developing',
    skills: [
      { name: 'Recognizes own written name on cubby and art', status: 'Achieved' },
      { name: 'Demonstrates book handling (front-to-back, page turning)', status: 'Achieved' },
      { name: 'Identifies initial letter sounds (A, B, S, M)', status: 'Developing' },
    ],
    note: 'Loves picture books and creates her own oral stories.',
  },
];

export const MonthlyProgressPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('Sunshine Classroom');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Record<string, MonthlyReport>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await api.getChildren();
    setLoading(false);
    if (res.success && res.data && res.data.length > 0) {
      setChildren(res.data);
      const firstId = res.data[0].id;
      setSelectedChildId(firstId);

      // Initialize default realistic monthly report structures
      const initialReports: Record<string, MonthlyReport> = {};
      res.data.forEach((c: any, index: number) => {
        initialReports[c.id] = {
          childId: c.id,
          childName: `${c.first_name} ${c.last_name}`,
          classroom: c.classroom_name || 'Sunshine Classroom',
          age: c.calculated_age?.formatted || '4 yrs',
          month: 'September 2026',
          attendanceSummary: {
            present: index === 3 ? 17 : 20,
            absent: index === 3 ? 3 : 1,
            late: index === 5 ? 2 : 0,
          },
          domains: JSON.parse(JSON.stringify(DEFAULT_DOMAINS)),
          teacherSummary:
            index === 0
              ? 'Emma has had a joyful month adapting quickly to classroom routines. She shows great enthusiasm during story time, collaborates warmly with classmates, and takes proud ownership of creative art projects.'
              : `${c.first_name} has shown steady growth in social confidence and active participation during classroom discovery centers this month.`,
          highlights:
            index === 0
              ? 'Built an elaborate wooden bridge with blocks during free play and invited two peers to share the pretend journey!'
              : `Demonstrated wonderful focus during fine motor sensory play and helped tidy up the activity center with care.`,
          status: index === 0 ? 'published' : 'draft',
          publishedAt: index === 0 ? 'Sep 15, 2026' : undefined,
          teacherName: 'Teacher Helen Brooks',
        };
      });
      setReports(initialReports);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeReport = reports[selectedChildId];

  const updateDomainStatus = (
    domainIndex: number,
    status: 'Emerging' | 'Developing' | 'Achieved'
  ) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].domains[domainIndex].status = status;
    setReports(updated);
  };

  const updateSkillStatus = (
    domainIndex: number,
    skillIndex: number,
    status: 'Emerging' | 'Developing' | 'Achieved'
  ) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].domains[domainIndex].skills[skillIndex].status = status;
    setReports(updated);
  };

  const updateDomainNote = (domainIndex: number, note: string) => {
    if (!activeReport) return;
    const updated = { ...reports };
    updated[selectedChildId].domains[domainIndex].note = note;
    setReports(updated);
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
    showToast('Draft progress report saved successfully.');
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
    showToast('Monthly Progress Report published! It is now accessible to parents in their portal.');
  };

  const getStatusBadge = (status: 'Emerging' | 'Developing' | 'Achieved') => {
    switch (status) {
      case 'Achieved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Developing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Emerging':
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-ink-500">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#20BDB2] to-[#38D3C7] text-white flex items-center justify-center mx-auto mb-3 animate-pulse shadow-md">
          🌱
        </div>
        <p className="font-bold text-[#0B4E49]">Loading Monthly Progress Review...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Baloo_2']">
              Monthly Progress Review &amp; Reports
            </h2>
            <span className="bg-[#E0F7F4] text-[#0B4E49] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#C3EFEB]">
              Ages 1–6
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Periodic 1-to-2 page development review across the 6 early years domains. Replaces tedious daily forms with meaningful monthly growth milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-ivory-100 text-ink-800 text-xs font-bold transition border border-ivory-300 shadow-xs"
          >
            <Eye size={14} className="text-[#21B8AF]" />
            <span>Preview Report (1–2 Pages)</span>
          </button>
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-800 text-xs font-bold transition border border-ivory-300"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition"
          >
            <Send size={14} />
            <span>Publish to Parent Portal</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Selector Toolbar: Month, Classroom, Child */}
      <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-ink-600 mb-1">
            Reporting Period
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          >
            <option>September 2026</option>
            <option>October 2026</option>
            <option>November 2026</option>
            <option>December 2026</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-600 mb-1">
            Classroom
          </label>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          >
            <option>Sunshine Classroom (KG 1)</option>
            <option>Rainbow Classroom (Nursery)</option>
            <option>Butterfly Room (Toddlers)</option>
            <option>Little Explorers (KG 2)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-600 mb-1">
            Select Child Roster
          </label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-3 py-2 bg-ivory-50 border border-[#C3EFEB] rounded-xl text-xs font-bold text-[#0B4E49] focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name} ({c.calculated_age?.formatted || 'Early Years'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeReport && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Column: 6 Domains Assessment */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-ivory-200">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#21B8AF]" />
                  <h3 className="text-sm font-bold text-ink-900">
                    6 Early Years Development Domains
                  </h3>
                </div>
                <span className="text-[11px] text-ink-500 font-medium">
                  Status Legend: <strong>Emerging</strong> (○) • <strong>Developing</strong> (◐) • <strong>Achieved</strong> (✓)
                </span>
              </div>

              <div className="space-y-4">
                {activeReport.domains.map((domain, dIdx) => (
                  <div
                    key={domain.area}
                    className="p-4 rounded-2xl border border-ivory-200 bg-ivory-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#21B8AF]" />
                        <h4 className="text-xs font-extrabold text-ink-900 uppercase tracking-wider">
                          {domain.area}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(['Emerging', 'Developing', 'Achieved'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateDomainStatus(dIdx, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                              domain.status === st
                                ? getStatusBadge(st) + ' shadow-xs ring-1 ring-offset-1 ring-primary-500'
                                : 'bg-white text-ink-600 border-ivory-300 hover:bg-ivory-100'
                            }`}
                          >
                            {st === 'Achieved' ? '✓ ' : st === 'Developing' ? '◐ ' : '○ '}
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Skills Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-ivory-200/80">
                      {domain.skills.map((sk, sIdx) => (
                        <div
                          key={sk.name}
                          className="p-2 rounded-xl bg-white border border-ivory-200 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="text-[11px] text-ink-800 font-medium leading-tight">
                            {sk.name}
                          </span>
                          <select
                            value={sk.status}
                            onChange={(e) =>
                              updateSkillStatus(
                                dIdx,
                                sIdx,
                                e.target.value as 'Emerging' | 'Developing' | 'Achieved'
                              )
                            }
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                              sk.status
                            )} focus:outline-none`}
                          >
                            <option value="Emerging">Emerging</option>
                            <option value="Developing">Developing</option>
                            <option value="Achieved">Achieved</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* Teacher Observation note for this domain */}
                    <div>
                      <input
                        type="text"
                        value={domain.note}
                        onChange={(e) => updateDomainNote(dIdx, e.target.value)}
                        placeholder={`Teacher note for ${domain.area}...`}
                        className="w-full px-3 py-1.5 bg-white border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-[#21B8AF]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Attendance Summary, Teacher Summary, Highlights, Publish Card */}
          <div className="space-y-4">
            {/* Child Status Card */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold text-lg flex items-center justify-center border border-[#C3EFEB]">
                  {activeReport.childName[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-ink-900">
                    {activeReport.childName}
                  </h3>
                  <p className="text-xs text-ink-500">
                    {activeReport.classroom} • {activeReport.age}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-xs">
                <span className="text-ink-500 font-medium">Report Status:</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                    activeReport.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeReport.status === 'published' ? '✓ Published to Parents' : '○ Draft in Progress'}
                </span>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#21B8AF]" />
                  Monthly Attendance Summary
                </h4>
                <span className="text-[10px] text-ink-500 font-semibold">
                  {selectedMonth}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Present</span>
                  <p className="text-lg font-extrabold text-emerald-900 mt-0.5">
                    {activeReport.attendanceSummary.present}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-dustyrose-50 border border-dustyrose-200">
                  <span className="text-[10px] font-bold text-dustyrose-700 uppercase">Absent</span>
                  <p className="text-lg font-extrabold text-dustyrose-900 mt-0.5">
                    {activeReport.attendanceSummary.absent}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Late</span>
                  <p className="text-lg font-extrabold text-amber-900 mt-0.5">
                    {activeReport.attendanceSummary.late}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Summary Text */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-ink-900">
                Teacher Summary &amp; Overview
              </label>
              <p className="text-[11px] text-ink-500">
                Warm, encouraging narrative written for parents covering social adaptation, learning curiosity, and classroom routines.
              </p>
              <textarea
                rows={4}
                value={activeReport.teacherSummary}
                onChange={(e) => updateTeacherSummary(e.target.value)}
                placeholder="Write a concise monthly overview..."
                className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
              />
            </div>

            {/* Highlights */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-ink-900">
                Special Moments &amp; Highlights
              </label>
              <p className="text-[11px] text-ink-500">
                One or two proud milestones or memorable joyful moments from this month.
              </p>
              <textarea
                rows={3}
                value={activeReport.highlights}
                onChange={(e) => updateHighlights(e.target.value)}
                placeholder="Memorable moment this month..."
                className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Report Card Modal Preview (1–2 Pages Printable) */}
      {showPreviewModal && activeReport && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-ivory-300 overflow-hidden my-8">
            {/* Modal Controls */}
            <div className="bg-ivory-100 px-6 py-3 border-b border-ivory-200 flex items-center justify-between">
              <span className="text-xs font-bold text-ink-700">
                Parent-Facing Monthly Report Card Preview
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
            <div className="p-8 space-y-6 text-ink-900 print:p-0">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#21B8AF] pb-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                  <div>
                    <h1 className="text-xl font-black text-[#4B4039] font-['Baloo_2']">
                      Bubbles Early Years School
                    </h1>
                    <p className="text-xs font-bold text-[#21B8AF]">
                      Monthly Development &amp; Progress Report
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-ink-900">{selectedMonth}</p>
                  <p className="text-[11px] text-ink-500 font-medium">Published: {activeReport.publishedAt || 'Draft'}</p>
                </div>
              </div>

              {/* Child Info Banner */}
              <div className="bg-[#F0FBF9] p-4 rounded-2xl border border-[#C3EFEB] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-ink-500 font-medium">Child Name</span>
                  <p className="font-extrabold text-ink-900 text-sm mt-0.5">{activeReport.childName}</p>
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
                <h3 className="text-xs font-black uppercase tracking-wider text-ink-800 mb-3">
                  Early Years Developmental Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeReport.domains.map((dom) => (
                    <div
                      key={dom.area}
                      className="p-3.5 rounded-xl border border-ivory-200 bg-ivory-50/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-ink-900">{dom.area}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                            dom.status
                          )}`}
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
                  <h4 className="text-xs font-bold text-ink-900 mb-1">Teacher Summary</h4>
                  <p className="text-xs text-ink-700 leading-relaxed bg-ivory-50 p-3 rounded-xl border border-ivory-200">
                    {activeReport.teacherSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-ink-900 mb-1">Classroom Highlights &amp; Joyful Moments</h4>
                  <p className="text-xs text-ink-700 leading-relaxed bg-[#F0FBF9] p-3 rounded-xl border border-[#C3EFEB]">
                    🌟 {activeReport.highlights}
                  </p>
                </div>
              </div>

              {/* Footer with Signatures */}
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
