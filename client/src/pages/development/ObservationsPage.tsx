import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  BookOpen,
  User,
  Trash2,
  Clock,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';

interface Observation {
  id: string;
  childId: string;
  childName: string;
  classroom: string;
  domain: string;
  skill: string;
  status: 'Emerging' | 'Developing' | 'Achieved';
  note: string;
  date: string;
  teacherName: string;
}

const DOMAINS = [
  'All Domains',
  'Cognitive',
  'Language & Communication',
  'Social & Emotional',
  'Physical',
  'Creative',
  'Early Literacy',
];

export const ObservationsPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formChildId, setFormChildId] = useState('');
  const [formDomain, setFormDomain] = useState('Cognitive');
  const [formSkill, setFormSkill] = useState('');
  const [formStatus, setFormStatus] = useState<'Emerging' | 'Developing' | 'Achieved'>('Developing');
  const [formNote, setFormNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await api.getChildren();
    setLoading(false);
    if (res.success && res.data) {
      setChildren(res.data);
      if (res.data.length > 0) {
        setFormChildId(res.data[0].id);
      }

      // Initial realistic observations
      setObservations([
        {
          id: 'obs-1',
          childId: res.data[0]?.id || 'c1',
          childName: res.data[0] ? `${res.data[0].first_name} ${res.data[0].last_name}` : 'Emma Johnson',
          classroom: 'Sunshine Classroom',
          domain: 'Language & Communication',
          skill: 'Expressing ideas during story circle',
          status: 'Achieved',
          note: 'Emma retold the sequence of The Very Hungry Caterpillar in her own words, accurately naming the fruits in order.',
          date: 'Sep 14, 2026',
          teacherName: 'Teacher Helen',
        },
        {
          id: 'obs-2',
          childId: res.data[0]?.id || 'c1',
          childName: res.data[0] ? `${res.data[0].first_name} ${res.data[0].last_name}` : 'Emma Johnson',
          classroom: 'Sunshine Classroom',
          domain: 'Social & Emotional',
          skill: 'Sharing and cooperating in block center',
          status: 'Achieved',
          note: 'Invited Lucas to build together when they both wanted the blue arches. Negotiated turns without needing teacher mediation.',
          date: 'Sep 12, 2026',
          teacherName: 'Teacher Helen',
        },
        {
          id: 'obs-3',
          childId: res.data[1]?.id || 'c2',
          childName: res.data[1] ? `${res.data[1].first_name} ${res.data[1].last_name}` : 'Lucas Miller',
          classroom: 'Sunshine Classroom',
          domain: 'Physical',
          skill: 'Fine motor scissor grip',
          status: 'Developing',
          note: 'Holds scissors with proper thumb-up position and cuts straight lines with focused concentration.',
          date: 'Sep 11, 2026',
          teacherName: 'Teacher Helen',
        },
        {
          id: 'obs-4',
          childId: res.data[2]?.id || 'c3',
          childName: res.data[2] ? `${res.data[2].first_name} ${res.data[2].last_name}` : 'Sophia Chen',
          classroom: 'Rainbow Classroom',
          domain: 'Cognitive',
          skill: 'Pattern recognition & color sorting',
          status: 'Achieved',
          note: 'Created alternating red-yellow-blue bead patterns independently and explained the sequence to her peers.',
          date: 'Sep 10, 2026',
          teacherName: 'Teacher Sarah',
        },
      ]);
    }
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const child = children.find((c) => c.id === formChildId) || children[0];
    const newObs: Observation = {
      id: `obs-${Date.now()}`,
      childId: child ? child.id : 'unknown',
      childName: child ? `${child.first_name} ${child.last_name}` : 'Unknown Child',
      classroom: child ? child.classroom_name || 'Sunshine Classroom' : 'Sunshine Classroom',
      domain: formDomain,
      skill: formSkill,
      status: formStatus,
      note: formNote,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      teacherName: 'Teacher Helen',
    };

    setObservations([newObs, ...observations]);
    setShowAddModal(false);
    setFormSkill('');
    setFormNote('');
  };

  const handleDelete = (id: string) => {
    setObservations(observations.filter((o) => o.id !== id));
  };

  const filteredObservations = observations.filter((o) => {
    const matchesDomain = selectedDomain === 'All Domains' || o.domain === selectedDomain;
    const matchesSearch =
      searchQuery === '' ||
      o.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Baloo_2']">
              Developmental Observations
            </h2>
            <span className="bg-[#E0F7F4] text-[#0B4E49] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#C3EFEB]">
              Meaningful &amp; Occasional
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Record qualitative milestone observations when meaningful growth happens, without daily paperwork pressure.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition"
        >
          <Plus size={15} />
          <span>Record New Observation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-ink-600 shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} /> Domain:
          </span>
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedDomain === d
                  ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search child or observation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          />
        </div>
      </div>

      {/* Observations Feed */}
      <div className="space-y-3">
        {filteredObservations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300 text-xs text-ink-500">
            No observations match your current filter. Click "Record New Observation" above.
          </div>
        ) : (
          filteredObservations.map((obs) => (
            <div
              key={obs.id}
              className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs hover:border-[#C3EFEB] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-sm border border-[#C3EFEB]">
                    {obs.childName[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-ink-900">{obs.childName}</h3>
                    <p className="text-[11px] text-ink-500">
                      {obs.classroom} • Observed by {obs.teacherName} on {obs.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#0B4E49] bg-[#E0F7F4] px-2.5 py-0.5 rounded-full border border-[#C3EFEB]">
                    {obs.domain}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      obs.status
                    )}`}
                  >
                    {obs.status === 'Achieved' ? '✓ ' : obs.status === 'Developing' ? '◐ ' : '○ '}
                    {obs.status}
                  </span>
                  <button
                    onClick={() => handleDelete(obs.id)}
                    title="Delete observation"
                    className="p-1.5 text-ink-300 hover:text-dustyrose-600 rounded-lg transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="bg-ivory-50 p-3 rounded-2xl border border-ivory-200 space-y-1">
                <p className="text-xs font-bold text-ink-900">
                  Target Skill: <span className="font-normal text-ink-700">{obs.skill}</span>
                </p>
                <p className="text-xs text-ink-800 leading-relaxed italic">"{obs.note}"</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Observation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <h3 className="text-sm font-extrabold text-ink-900">Record New Observation</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink-700 mb-1">Child</label>
                <select
                  value={formChildId}
                  onChange={(e) => setFormChildId(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} ({c.classroom_name || 'Sunshine Room'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Developmental Domain</label>
                <select
                  value={formDomain}
                  onChange={(e) => setFormDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                >
                  {DOMAINS.filter((d) => d !== 'All Domains').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Skill / Indicator</label>
                <input
                  type="text"
                  placeholder="e.g. Recognizing colors, sorting blocks, taking turns"
                  value={formSkill}
                  onChange={(e) => setFormSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Observed Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Emerging', 'Developing', 'Achieved'] as const).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setFormStatus(st)}
                      className={`py-1.5 rounded-xl font-bold border transition ${
                        formStatus === st
                          ? getStatusBadge(st) + ' shadow-xs ring-1 ring-offset-1 ring-primary-500'
                          : 'bg-white text-ink-600 border-ivory-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Observation Narrative</label>
                <textarea
                  rows={3}
                  placeholder="Describe what the child did or said..."
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white font-bold transition shadow-sm"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
