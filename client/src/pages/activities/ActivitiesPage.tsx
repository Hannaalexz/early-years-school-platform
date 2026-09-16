import React, { useState } from 'react';
import {
  Palette,
  Plus,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Camera,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  classroom: string;
  developmentAreas: string[];
  notes: string;
  photoCount: number;
  tags: string[];
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Finger Painting & Color Mixing',
    date: 'Sep 16, 2026',
    classroom: 'Sunshine Classroom (KG 1)',
    developmentAreas: ['Creative', 'Physical (Fine Motor)'],
    notes: 'Children explored primary color blending on large floor butcher paper, discovering how blue and yellow create vibrant emerald green.',
    photoCount: 4,
    tags: ['Sensory', 'Art', 'Colors'],
  },
  {
    id: 'act-2',
    title: 'Story Circle: The Very Hungry Caterpillar',
    date: 'Sep 15, 2026',
    classroom: 'Sunshine Classroom (KG 1)',
    developmentAreas: ['Language & Communication', 'Early Literacy'],
    notes: 'Group read-aloud focusing on days of the week, fruit vocabulary, and butterfly life cycles. Children took turns holding felt fruits.',
    photoCount: 2,
    tags: ['Reading', 'Circle Time', 'Sequencing'],
  },
  {
    id: 'act-3',
    title: 'Outdoor Autumn Leaf Scavenger Hunt',
    date: 'Sep 14, 2026',
    classroom: 'Rainbow Classroom (Nursery)',
    developmentAreas: ['Cognitive', 'Physical (Gross Motor)'],
    notes: 'Collected dry leaves of different shapes and textures in woven baskets, then sorted them by size and crunchy sound.',
    photoCount: 6,
    tags: ['Nature', 'Outdoor Play', 'Sorting'],
  },
  {
    id: 'act-4',
    title: 'Sensory Texture Ball Exploration',
    date: 'Sep 12, 2026',
    classroom: 'Butterfly Room (Toddlers)',
    developmentAreas: ['Physical', 'Cognitive'],
    notes: 'Toddlers rolled and squeezed spiky, squishy, and smooth sensory balls, developing tactile awareness and rolling coordination.',
    photoCount: 3,
    tags: ['Toddlers', 'Tactile', 'Movement'],
  },
];

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formClassroom, setFormClassroom] = useState('Sunshine Classroom (KG 1)');
  const [formAreas, setFormAreas] = useState<string[]>(['Creative']);
  const [formNotes, setFormNotes] = useState('');

  const toggleArea = (area: string) => {
    setFormAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title: formTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      classroom: formClassroom,
      developmentAreas: formAreas,
      notes: formNotes,
      photoCount: 1,
      tags: ['Classroom Play'],
    };

    setActivities([newAct, ...activities]);
    setShowAddModal(false);
    setFormTitle('');
    setFormNotes('');
  };

  const handleDelete = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const filtered = activities.filter((a) => {
    const matchesClass = selectedClassroom === 'All' || a.classroom.includes(selectedClassroom);
    const matchesSearch =
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Baloo_2']">
              Classroom Activities
            </h2>
            <span className="bg-[#E0F7F4] text-[#0B4E49] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#C3EFEB]">
              Sensory &amp; Play-Based
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Log play-based classroom learning, developmental areas, and shared photo moments without rigid syllabus forms.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-sm shadow-[#21B8AF]/25 transition"
        >
          <Plus size={15} />
          <span>Record New Activity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-ivory-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-ink-600 shrink-0 flex items-center gap-1">
            <Filter size={13} /> Room:
          </span>
          {['All', 'Sunshine', 'Rainbow', 'Butterfly'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClassroom(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedClassroom === cls
                  ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white shadow-xs'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
              }`}
            >
              {cls === 'All' ? 'All Classrooms' : `${cls} Room`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-5 border border-ivory-300 shadow-xs hover:border-[#C3EFEB] transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-ink-900">{act.title}</h3>
                  <p className="text-[11px] text-ink-500 mt-0.5">
                    {act.classroom} • {act.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink-600 bg-ivory-100 px-2 py-0.5 rounded-md border border-ivory-200">
                    <Camera size={11} className="text-[#21B8AF]" /> {act.photoCount} Photos
                  </span>
                  <button
                    onClick={() => handleDelete(act.id)}
                    className="p-1 text-ink-300 hover:text-dustyrose-600 rounded transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {act.developmentAreas.map((area) => (
                  <span
                    key={area}
                    className="text-[10px] font-bold text-[#0B4E49] bg-[#E0F7F4] px-2.5 py-0.5 rounded-full border border-[#C3EFEB]"
                  >
                    🌱 {area}
                  </span>
                ))}
              </div>

              <p className="text-xs text-ink-700 leading-relaxed bg-ivory-50 p-3 rounded-2xl border border-ivory-200">
                {act.notes}
              </p>
            </div>

            <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-[11px] text-ink-500">
              <span>Tags: {act.tags.join(', ')}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Synced to Portal
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <h3 className="text-sm font-extrabold text-ink-900">Record New Activity</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  placeholder="e.g. Autumn Leaf Collage or Water Play Fun"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Classroom</label>
                <select
                  value={formClassroom}
                  onChange={(e) => setFormClassroom(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                >
                  <option>Sunshine Classroom (KG 1)</option>
                  <option>Rainbow Classroom (Nursery)</option>
                  <option>Butterfly Room (Toddlers)</option>
                  <option>Little Explorers (KG 2)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">
                  Developmental Focus Areas (Select one or more)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Cognitive',
                    'Language & Communication',
                    'Social & Emotional',
                    'Physical (Gross Motor)',
                    'Physical (Fine Motor)',
                    'Creative',
                    'Early Literacy',
                  ].map((area) => {
                    const isSelected = formAreas.includes(area);
                    return (
                      <button
                        type="button"
                        key={area}
                        onClick={() => toggleArea(area)}
                        className={`p-2 rounded-xl text-[11px] font-bold text-left border transition ${
                          isSelected
                            ? 'bg-[#E0F7F4] text-[#0B4E49] border-[#20BDB2] shadow-xs'
                            : 'bg-ivory-50 text-ink-700 border-ivory-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Observation Notes</label>
                <textarea
                  rows={3}
                  placeholder="Short description of what the children explored or accomplished..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
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
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
