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
  X,
  Award,
  HelpCircle,
  Heart,
  Smile
} from 'lucide-react';
import { api } from '../../services/api.js';
import { Pagination } from '../../components/common/Pagination.js';

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
  { name: 'All Domains', icon: '✨' },
  { name: 'Cognitive & Thinking', icon: '🧩' },
  { name: 'Language & Speech', icon: '🗣️' },
  { name: 'Social & Emotional', icon: '💛' },
  { name: 'Physical & Movement', icon: '🏃' },
  { name: 'Creative & Art', icon: '🎨' },
  { name: 'Early Literacy & Reading', icon: '📖' },
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Cognitive & Thinking': [
    'Color and shape sorting with blocks',
    'Cause and effect water play exploration',
    'Counting counters with 1-to-1 correspondence',
    'Spatial reasoning floor puzzle completion',
  ],
  'Language & Speech': [
    'Expressing ideas during story circle',
    'Asking descriptive "why" and "how" questions',
    'Following multi-step verbal instructions',
    'Bilingual vocabulary expression in play',
  ],
  'Social & Emotional': [
    'Sharing and cooperating in block center',
    'Showing comforting empathy toward an upset peer',
    'Smooth routine transitions without distress',
    'Cooperative pretend dramatic play',
  ],
  'Physical & Movement': [
    'Fine motor safety scissor control',
    'Dynamic tripod pencil & crayon grasp',
    'Gross motor balance beam & outdoor hopping',
    'Self-help coat zipping & hand washing',
  ],
  'Creative & Art': [
    'Color blending & watercolor easel discovery',
    'Imaginative pretend kitchen role-play',
    'Rhythm clapping & singing participation',
    'Clay molding & sensory texture sculpting',
  ],
  'Early Literacy & Reading': [
    'Recognizing own written name on cubby',
    'Connecting initial phonetic sounds',
    'Proper book holding & page turning left-to-right',
    'Rhyming word recognition in songs',
  ],
};

const CLASSROOMS = [
  { id: 'all', name: 'All Rooms', icon: '🏫' },
  { id: 'Sunshine Classroom (KG 1)', name: 'Sunshine (KG1)', icon: '☀️' },
  { id: 'Rainbow Classroom (Nursery)', name: 'Rainbow (Nursery)', icon: '🌈' },
  { id: 'Butterfly Room (Toddlers)', name: 'Butterfly (Toddlers)', icon: '🦋' },
  { id: 'Little Explorers (KG 2)', name: 'Little Explorers (KG2)', icon: '🔍' },
];

interface ObservationsPageProps {
  onNavigate?: (path: string) => void;
}

export const ObservationsPage: React.FC<ObservationsPageProps> = ({ onNavigate }) => {
  const [children, setChildren] = useState<any[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Add Form state
  const [formChildId, setFormChildId] = useState('');
  const [formDomain, setFormDomain] = useState('Cognitive & Thinking');
  const [formSkill, setFormSkill] = useState('Color and shape sorting with blocks');
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

      setObservations([
        {
          id: 'obs-1',
          childId: res.data[0]?.id || 'c1',
          childName: res.data[0] ? `${res.data[0].first_name} ${res.data[0].last_name}` : 'Emma Johnson',
          classroom: 'Sunshine Classroom (KG 1)',
          domain: 'Language & Speech',
          skill: 'Expressing ideas during story circle',
          status: 'Achieved',
          note: 'Emma retold the sequence of The Very Hungry Caterpillar in her own words, accurately naming the fruits in order with lovely enthusiasm.',
          date: 'Sep 16, 2026',
          teacherName: 'Teacher Helen Brooks',
        },
        {
          id: 'obs-2',
          childId: res.data[0]?.id || 'c1',
          childName: res.data[0] ? `${res.data[0].first_name} ${res.data[0].last_name}` : 'Emma Johnson',
          classroom: 'Sunshine Classroom (KG 1)',
          domain: 'Social & Emotional',
          skill: 'Sharing and cooperating in block center',
          status: 'Achieved',
          note: 'Invited Lucas to build together when they both wanted the blue arches. Negotiated turns happily without needing teacher mediation.',
          date: 'Sep 14, 2026',
          teacherName: 'Teacher Helen Brooks',
        },
        {
          id: 'obs-3',
          childId: res.data[1]?.id || 'c2',
          childName: res.data[1] ? `${res.data[1].first_name} ${res.data[1].last_name}` : 'Lucas Miller',
          classroom: 'Sunshine Classroom (KG 1)',
          domain: 'Physical & Movement',
          skill: 'Fine motor safety scissor control',
          status: 'Developing',
          note: 'Holds scissors with proper thumb-up position and cuts along curved green paper with focused concentration.',
          date: 'Sep 12, 2026',
          teacherName: 'Teacher Helen Brooks',
        },
        {
          id: 'obs-4',
          childId: res.data[2]?.id || 'c3',
          childName: res.data[2] ? `${res.data[2].first_name} ${res.data[2].last_name}` : 'Sophia Chen',
          classroom: 'Rainbow Classroom (Nursery)',
          domain: 'Cognitive & Thinking',
          skill: 'Color and shape sorting with blocks',
          status: 'Achieved',
          note: 'Created alternating red-yellow-blue bead patterns independently and explained the sequence to peers at the discovery table.',
          date: 'Sep 11, 2026',
          teacherName: 'Teacher Sarah Vance',
        },
        {
          id: 'obs-5',
          childId: res.data[3]?.id || 'c4',
          childName: res.data[3] ? `${res.data[3].first_name} ${res.data[3].last_name}` : 'Daniel Solomon',
          classroom: 'Sunshine Classroom (KG 1)',
          domain: 'Early Literacy & Reading',
          skill: 'Recognizing own written name on cubby',
          status: 'Achieved',
          note: 'Pointed to "D-A-N-I-E-L" on his art folder and identified the "D" sound: "D like Dinosaur!"',
          date: 'Sep 10, 2026',
          teacherName: 'Teacher Helen Brooks',
        },
        {
          id: 'obs-6',
          childId: res.data[4]?.id || 'c5',
          childName: res.data[4] ? `${res.data[4].first_name} ${res.data[4].last_name}` : 'Mia Williams',
          classroom: 'Butterfly Room (Toddlers)',
          domain: 'Creative & Art',
          skill: 'Color blending & watercolor easel discovery',
          status: 'Achieved',
          note: 'Delighted in dipping broad paintbrushes into yellow and blue watercolors, shouting with glee when they merged into green.',
          date: 'Sep 09, 2026',
          teacherName: 'Teacher Michael Lee',
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
      classroom: child ? child.classroom_name || 'Sunshine Classroom (KG 1)' : 'Sunshine Classroom (KG 1)',
      domain: formDomain,
      skill: formSkill,
      status: formStatus,
      note: formNote,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      teacherName: 'Teacher Helen Brooks',
    };

    setObservations([newObs, ...observations]);
    setShowAddModal(false);
    setFormNote('');
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setObservations(observations.filter((o) => o.id !== id));
  };

  const filteredObservations = observations.filter((o) => {
    const matchesDomain =
      selectedDomain === 'All Domains' || o.domain.includes(selectedDomain.split(' ')[0]);
    const matchesRoom =
      selectedRoom === 'all' ||
      (selectedRoom.includes('Sunshine') && o.classroom.includes('Sunshine')) ||
      (selectedRoom.includes('Rainbow') && o.classroom.includes('Rainbow')) ||
      (selectedRoom.includes('Butterfly') && o.classroom.includes('Butterfly')) ||
      (selectedRoom.includes('Little Explorers') && o.classroom.includes('Little Explorers'));

    const matchesSearch =
      searchQuery === '' ||
      o.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.note.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesRoom && matchesSearch;
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
    <div className="space-y-5 max-w-5xl mx-auto pb-14 font-sans">
      {/* Friendly Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-ivory-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 font-['Quicksand']">
              Developmental Observations Feed
            </h2>
          </div>
          <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
            Log meaningful milestone moments as children explore, create, and discover.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition font-['Quicksand'] flex items-center gap-1.5 shrink-0"
        >
          <Plus size={15} />
          <span>Record Observation</span>
        </button>
      </div>

      {/* Classroom & Domain Filter Strip */}
      <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs space-y-3 font-['Quicksand']">
        {/* Row 1: Classroom Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-ivory-200">
          <span className="text-xs font-bold text-ink-500 mr-1">Classroom:</span>
          {CLASSROOMS.map((room) => {
            const isSelected = selectedRoom === room.id;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room.id);
                  setCurrentPage(1);
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

        {/* Row 2: Domain Area Pills & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {DOMAINS.map((d) => {
              const isSelected = selectedDomain === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() => {
                    setSelectedDomain(d.name);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-2xs'
                      : 'bg-ivory-50 hover:bg-ivory-100 text-ink-700 border border-ivory-200'
                  }`}
                >
                  <span>{d.icon}</span>
                  <span>{d.name.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-56 shrink-0 font-['Outfit']">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search child or skill..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
            />
          </div>
        </div>
      </div>

      {/* Observations Feed (Spacious, Warm, Friendly) */}
      <div className="space-y-3 font-['Outfit']">
        {filteredObservations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300 text-xs text-ink-500 space-y-2">
            <span className="text-3xl block">🌱</span>
            <p className="font-bold text-ink-700 font-['Quicksand'] text-sm">No observations found matching this filter.</p>
            <p>Click "Record Observation" above to log a new qualitative milestone.</p>
          </div>
        ) : (
          <>
            {filteredObservations
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((obs) => (
                <div
                  key={obs.id}
                  className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs hover:border-[#C3EFEB] transition-all space-y-3"
                >
                  {/* Top Row: Child Avatar, Info, Domain Badge */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-sm border border-[#C3EFEB] font-['Quicksand']">
                        {obs.childName[0]}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-ink-900 font-['Quicksand']">
                          {obs.childName}
                        </h4>
                        <p className="text-[11px] text-ink-500">
                          {obs.classroom} • Observed by <strong className="text-ink-700">{obs.teacherName}</strong> on {obs.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-['Quicksand']">
                      <span className="text-xs font-bold text-[#0B4E49] bg-[#E0F7F4] px-3 py-1 rounded-full border border-[#C3EFEB]">
                        {obs.domain}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
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

                  {/* Skill & Note Content */}
                  <div className="bg-ivory-50 p-3.5 rounded-2xl border border-ivory-200 space-y-1">
                    <p className="text-xs font-bold text-ink-900">
                      Observed Skill: <span className="font-normal text-ink-700">{obs.skill}</span>
                    </p>
                    <p className="text-xs text-ink-800 leading-relaxed italic bg-white p-3 rounded-xl border border-ivory-200/70">
                      "{obs.note}"
                    </p>
                  </div>
                </div>
              ))}

            <div className="bg-white p-3 rounded-3xl border border-ivory-300 shadow-xs">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredObservations.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[6, 12, 18]}
                itemLabel="observations"
              />
            </div>
          </>
        )}
      </div>

      {/* Record Observation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-ink-900 font-['Quicksand'] flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#21B8AF]" />
                  Record Milestone Observation
                </h3>
                <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
                  Keep a friendly note of genuine progress in class
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-3.5 text-xs font-['Outfit']">
              {/* Child */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Child</label>
                <select
                  value={formChildId}
                  onChange={(e) => setFormChildId(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] font-bold"
                  required
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} ({c.classroom_name || 'Sunshine Room'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Learning Area</label>
                <select
                  value={formDomain}
                  onChange={(e) => {
                    setFormDomain(e.target.value);
                    const firstSkill = SKILL_SUGGESTIONS[e.target.value]?.[0] || '';
                    setFormSkill(firstSkill);
                  }}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                >
                  {Object.keys(SKILL_SUGGESTIONS).map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              {/* Suggested Skills */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Observed Skill</label>
                <select
                  value={formSkill}
                  onChange={(e) => setFormSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF] mb-1.5"
                >
                  {SKILL_SUGGESTIONS[formDomain]?.map((sk) => (
                    <option key={sk} value={sk}>
                      {sk}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formSkill}
                  onChange={(e) => setFormSkill(e.target.value)}
                  placeholder="Or write custom observed skill..."
                  className="w-full px-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                />
              </div>

              {/* Status Pills */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Achievement Status</label>
                <div className="grid grid-cols-3 gap-2 font-['Quicksand'] font-bold">
                  {(['Emerging', 'Developing', 'Achieved'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormStatus(st)}
                      className={`py-1.5 rounded-xl border text-xs transition ${
                        formStatus === st
                          ? getStatusBadge(st) + ' ring-1 ring-offset-1 ring-[#21B8AF] shadow-2xs font-extrabold'
                          : 'bg-ivory-50 text-ink-600 border-ivory-200 hover:bg-ivory-100'
                      }`}
                    >
                      {st === 'Achieved' ? '✓ Achieved' : st === 'Developing' ? '◐ Growing' : '○ Emerging'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Observation Story &amp; Details</label>
                <textarea
                  rows={3}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="What did the child do or say? Describe the context..."
                  className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-2xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200 font-['Quicksand']">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-ink-700 font-bold transition"
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
