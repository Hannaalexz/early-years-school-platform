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
  Brain,
  MessageCircle,
  Activity,
  Palette,
  BookMarked,
  Heart
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

const DOMAIN_SECTIONS = [
  { name: 'Cognitive', icon: '🧩', color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { name: 'Language & Communication', icon: '🗣️', color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { name: 'Social & Emotional', icon: '💛', color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { name: 'Physical Development', icon: '🏃', color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { name: 'Creative Arts', icon: '🎨', color: '#EC4899', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  { name: 'Early Literacy', icon: '📖', color: '#06B6D4', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  Cognitive: [
    'Color and shape sorting with blocks',
    'Cause and effect water play exploration',
    'Counting counters with 1-to-1 correspondence',
    'Spatial reasoning floor puzzle completion',
    'Number sequence & pattern building',
  ],
  'Language & Communication': [
    'Expressing ideas during story circle',
    'Asking descriptive "why" and "how" questions',
    'Following multi-step verbal instructions',
    'Bilingual vocabulary expression in play',
    'Retelling story events with puppets',
  ],
  'Social & Emotional': [
    'Sharing and cooperating in block center',
    'Showing comforting empathy toward an upset peer',
    'Smooth routine transitions without distress',
    'Cooperative pretend dramatic play',
    'Self-regulating emotions during turn-taking',
  ],
  'Physical Development': [
    'Fine motor safety scissor control',
    'Dynamic tripod pencil & crayon grasp',
    'Gross motor balance beam & outdoor hopping',
    'Self-help coat zipping & hand washing',
    'Bead threading & finger dexterity',
  ],
  'Creative Arts': [
    'Color blending & watercolor easel discovery',
    'Imaginative pretend kitchen role-play',
    'Rhythm clapping & singing participation',
    'Clay molding & sensory texture sculpting',
    'Expressive free-form dance movement',
  ],
  'Early Literacy': [
    'Recognizing own written name on cubby',
    'Connecting initial phonetic sounds',
    'Proper book holding & page turning left-to-right',
    'Rhyming word recognition in songs',
    'Dictating drawing caption to educator',
  ],
};

const CLASSROOM_SECTIONS = [
  { id: 'all', name: 'All Sections', icon: '🏫' },
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
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Add Observation Form state
  const [formChildId, setFormChildId] = useState('');
  const [formDomain, setFormDomain] = useState('Cognitive');
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

      // Initial realistic observations
      setObservations([
        {
          id: 'obs-1',
          childId: res.data[0]?.id || 'c1',
          childName: res.data[0] ? `${res.data[0].first_name} ${res.data[0].last_name}` : 'Emma Johnson',
          classroom: 'Sunshine Classroom (KG 1)',
          domain: 'Language & Communication',
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
          note: 'Invited Lucas to build together when they both wanted the blue arches. Negotiated turns without needing teacher mediation.',
          date: 'Sep 14, 2026',
          teacherName: 'Teacher Helen Brooks',
        },
        {
          id: 'obs-3',
          childId: res.data[1]?.id || 'c2',
          childName: res.data[1] ? `${res.data[1].first_name} ${res.data[1].last_name}` : 'Lucas Miller',
          classroom: 'Sunshine Classroom (KG 1)',
          domain: 'Physical Development',
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
          domain: 'Cognitive',
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
          domain: 'Early Literacy',
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
          domain: 'Creative Arts',
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
    const matchesDomain = selectedDomain === 'All Domains' || o.domain === selectedDomain;
    const matchesSection =
      selectedSection === 'all' ||
      (selectedSection.includes('Sunshine') && o.classroom.includes('Sunshine')) ||
      (selectedSection.includes('Rainbow') && o.classroom.includes('Rainbow')) ||
      (selectedSection.includes('Butterfly') && o.classroom.includes('Butterfly')) ||
      (selectedSection.includes('Little Explorers') && o.classroom.includes('Little Explorers'));

    const matchesSearch =
      searchQuery === '' ||
      o.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.note.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesSection && matchesSearch;
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

  // Calculate observation counts per domain section
  const getDomainCount = (domainName: string) => {
    return observations.filter((o) => o.domain === domainName).length;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-14 font-sans">
      {/* Top Module Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-2 rounded-3xl border border-ivory-300 shadow-2xs font-['Quicksand']">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => onNavigate ? onNavigate('/development/monthly-progress') : undefined}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-ink-600 hover:bg-ivory-100 transition flex items-center gap-1.5 shrink-0"
          >
            <Award size={14} className="text-[#21B8AF]" />
            <span>Monthly Progress Reports</span>
          </button>
          <button
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Sparkles size={14} />
            <span>Observation Feed</span>
          </button>
          <button
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-ink-600 hover:bg-ivory-100 transition flex items-center gap-1.5 shrink-0"
          >
            <HelpCircle size={14} className="text-amber-500" />
            <span>Milestones Framework Guide</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition font-['Quicksand'] shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus size={15} />
          <span>Record New Observation</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Quicksand']">
              Qualitative Developmental Observations
            </h2>
            <span className="bg-[#E0F7F4] text-[#0B4E49] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#C3EFEB] font-['Quicksand']">
              Meaningful &amp; Qualitative
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 font-['Outfit'] mt-0.5">
            Log significant milestone moments as they happen during discovery play, free choice centers, and outdoor exploration.
          </p>
        </div>
      </div>

      {/* Domain Sections Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-['Outfit']">
        {DOMAIN_SECTIONS.map((sec) => {
          const count = getDomainCount(sec.name);
          const isSelected = selectedDomain === sec.name;

          return (
            <button
              key={sec.name}
              type="button"
              onClick={() => {
                setSelectedDomain(isSelected ? 'All Domains' : sec.name);
                setCurrentPage(1);
              }}
              className={`p-3.5 rounded-3xl border text-left transition-all shadow-2xs ${
                isSelected
                  ? 'bg-white border-[#21B8AF] ring-2 ring-[#21B8AF]/30 shadow-xs'
                  : 'bg-white border-ivory-300 hover:border-ivory-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{sec.icon}</span>
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    count > 0 ? 'bg-[#E0F7F4] text-[#0B4E49]' : 'bg-ivory-100 text-ink-400'
                  }`}
                >
                  {count} obs
                </span>
              </div>
              <p className="font-extrabold text-xs text-ink-900 mt-2 truncate font-['Quicksand']">
                {sec.name}
              </p>
              <span className="text-[10px] text-ink-400 block mt-0.5">
                {isSelected ? '✓ Filtered' : 'Click to filter'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Classroom Section Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-3xl bg-white border border-ivory-300 shadow-2xs font-['Quicksand']">
        <span className="text-xs font-bold text-ink-500 px-2">Classroom Section:</span>
        {CLASSROOM_SECTIONS.map((sec) => {
          const isSelected = selectedSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedSection(sec.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                  : 'bg-ivory-50 text-ink-700 hover:bg-[#F0FBF9] hover:text-[#0B4E49] border border-ivory-200'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar: Domain Switcher & Search */}
      <div className="bg-white p-3 rounded-3xl border border-ivory-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 font-['Outfit']">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-['Quicksand']">
          <span className="text-xs font-bold text-ink-500 shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} /> Domain:
          </span>
          <button
            onClick={() => {
              setSelectedDomain('All Domains');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedDomain === 'All Domains'
                ? 'bg-[#0B4E49] text-white shadow-2xs'
                : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
            }`}
          >
            All Domains
          </button>
          {DOMAIN_SECTIONS.map((d) => (
            <button
              key={d.name}
              onClick={() => {
                setSelectedDomain(d.name);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                selectedDomain === d.name
                  ? 'bg-[#0B4E49] text-white shadow-2xs'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
              }`}
            >
              <span>{d.icon}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search child or observation..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          />
        </div>
      </div>

      {/* Observations Feed */}
      <div className="space-y-3 font-['Outfit']">
        {filteredObservations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300 text-xs text-ink-500 font-['Outfit'] space-y-2">
            <span className="text-3xl block">🔍</span>
            <p className="font-bold text-ink-700">No observations match your current section or domain filter.</p>
            <p>Click "Record New Observation" above to add meaningful milestones for this child.</p>
          </div>
        ) : (
          <>
            {filteredObservations
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((obs) => {
                const domainInfo = DOMAIN_SECTIONS.find((d) => d.name === obs.domain) || DOMAIN_SECTIONS[0];

                return (
                  <div
                    key={obs.id}
                    className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-xs hover:border-[#C3EFEB] transition-all space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#E0F7F4] text-[#0B4E49] font-bold flex items-center justify-center text-sm border border-[#C3EFEB] font-['Quicksand']">
                          {obs.childName[0]}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-ink-900 font-['Quicksand']">
                            {obs.childName}
                          </h3>
                          <p className="text-[11px] text-ink-500">
                            {obs.classroom} • Observed by <strong className="text-ink-700">{obs.teacherName}</strong> on {obs.date}
                          </p>
                        </div>
                      </div>

                      {/* Domain & Status Badges */}
                      <div className="flex items-center gap-2 font-['Quicksand']">
                        <span className="text-[11px] font-bold text-[#0B4E49] bg-[#E0F7F4] px-3 py-1 rounded-full border border-[#C3EFEB] flex items-center gap-1">
                          <span>{domainInfo.icon}</span>
                          <span>{obs.domain}</span>
                        </span>
                        <span
                          className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getStatusBadge(
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

                    {/* Skill & Observation Narrative Quote */}
                    <div className="bg-ivory-50 p-3.5 rounded-2xl border border-ivory-200 space-y-1.5">
                      <p className="text-xs font-bold text-ink-900">
                        Target Skill: <span className="font-normal text-ink-700">{obs.skill}</span>
                      </p>
                      <p className="text-xs text-ink-800 leading-relaxed italic bg-white p-3 rounded-xl border border-ivory-200/70">
                        "{obs.note}"
                      </p>
                    </div>
                  </div>
                );
              })}

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

      {/* RECORD OBSERVATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-ink-900 font-['Quicksand'] flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#21B8AF]" />
                  Record Developmental Observation
                </h3>
                <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
                  Meaningful, qualitative evidence of child growth across domains
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-4 text-xs font-['Outfit']">
              {/* Select Child */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Select Child</label>
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

              {/* Select Domain Section */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Developmental Domain Section</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-['Quicksand']">
                  {DOMAIN_SECTIONS.map((dom) => {
                    const isSelected = formDomain === dom.name;
                    return (
                      <button
                        key={dom.name}
                        type="button"
                        onClick={() => {
                          setFormDomain(dom.name);
                          const firstSkill = SKILL_SUGGESTIONS[dom.name]?.[0] || '';
                          setFormSkill(firstSkill);
                        }}
                        className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 text-left ${
                          isSelected
                            ? 'bg-[#E0F7F4] text-[#0B4E49] border-[#21B8AF] shadow-2xs ring-1 ring-[#21B8AF]'
                            : 'bg-ivory-50 text-ink-700 border-ivory-200 hover:bg-ivory-100'
                        }`}
                      >
                        <span className="text-base">{dom.icon}</span>
                        <span className="truncate">{dom.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Skill (Suggested or custom) */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Target Milestone Skill</label>
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

              {/* Status Selector */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Achievement Status</label>
                <div className="grid grid-cols-3 gap-2 font-['Quicksand'] font-bold">
                  {(['Emerging', 'Developing', 'Achieved'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormStatus(st)}
                      className={`py-2 rounded-xl border text-xs transition ${
                        formStatus === st
                          ? getStatusBadge(st) + ' ring-1 ring-offset-1 ring-[#21B8AF] shadow-2xs'
                          : 'bg-ivory-50 text-ink-600 border-ivory-200 hover:bg-ivory-100'
                      }`}
                    >
                      {st === 'Achieved' ? '✓ ' : st === 'Developing' ? '◐ ' : '○ '}
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observation Narrative */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Teacher Observation Note</label>
                <textarea
                  rows={3}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Describe the context: what did the child say or do, how did they interact with materials, did they work independently or with peers..."
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

      {/* MILESTONES FRAMEWORK GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-ivory-300 overflow-hidden my-8 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-ink-900 font-['Quicksand'] flex items-center gap-2">
                  <Brain size={18} className="text-[#21B8AF]" />
                  Early Years Developmental Milestones Guide (Ages 1–6)
                </h3>
                <p className="text-xs text-ink-500 font-['Outfit'] mt-0.5">
                  Core learning expectations across early childhood sections and developmental domains
                </p>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs font-['Outfit']">
              {DOMAIN_SECTIONS.map((sec) => (
                <div key={sec.name} className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-ink-900 font-['Quicksand'] flex items-center gap-1.5">
                      <span>{sec.icon}</span>
                      <span>{sec.name} Domain Section</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E0F7F4] text-[#0B4E49] rounded-full border border-[#C3EFEB]">
                      Framework
                    </span>
                  </div>

                  <p className="text-xs text-ink-600">
                    Key milestone indicators to observe in early years learners:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-ink-800">
                    {SKILL_SUGGESTIONS[sec.name]?.map((item, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white border border-ivory-200 flex items-center gap-2">
                        <span className="text-[#21B8AF] font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-ivory-200">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white font-bold text-xs font-['Quicksand']"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
