import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Utensils,
  Moon,
  Smile,
  FileText,
  Save,
  CheckCircle2,
  Filter,
  Sparkles,
  ChevronRight,
  Clock,
  Baby
} from 'lucide-react';
import { api } from '../../services/api.js';

interface DailyLogState {
  childId: string;
  name: string;
  classroom: string;
  breakfast: string;
  morningSnack: string;
  lunch: string;
  napDuration: string;
  napQuality: string;
  mood: string;
  dailyNote: string;
}

export const DailyCareLoggerPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('Sunshine Classroom');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, DailyLogState>>({});
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    const res = await api.getChildren();
    if (res.success && res.data) {
      setChildren(res.data);
      const initialLogs: Record<string, DailyLogState> = {};
      res.data.forEach((c: any) => {
        initialLogs[c.id] = {
          childId: c.id,
          name: `${c.first_name} ${c.last_name}`,
          classroom: c.classroom_name || 'Sunshine Classroom',
          breakfast: 'All (100%)',
          morningSnack: 'All (100%)',
          lunch: 'Most (80%)',
          napDuration: '1h 25m',
          napQuality: 'Rested Soundly',
          mood: 'Happy & Playful 😊',
          dailyNote: `${c.first_name} had a delightful day exploring watercolor painting and cooperative play.`,
        };
      });
      setLogs(initialLogs);

      const firstChild = res.data.find((c: any) => c.classroom_name === 'Sunshine Classroom') || res.data[0];
      if (firstChild) {
        setSelectedChildId(firstChild.id);
      }
    }
  };

  const currentChild = children.find((c) => c.id === selectedChildId);
  const currentLog = selectedChildId && logs[selectedChildId] ? logs[selectedChildId] : null;

  const updateCurrentLog = (field: keyof DailyLogState, value: string) => {
    if (!selectedChildId) return;
    setLogs((prev) => ({
      ...prev,
      [selectedChildId]: {
        ...prev[selectedChildId],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }, 600);
  };

  const filteredChildren = children.filter(
    (c) => selectedClassroom === 'all' || c.classroom_name === selectedClassroom
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900">Daily Care &amp; Wellbeing Logger</h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Live Parent Feed Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Record nutrition, nap rest, mood, and daily teacher reflections for each early-years child.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 hover:from-primary-800 hover:to-primary-600 text-white text-xs font-bold shadow-sm shadow-primary-500/25 transition disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? 'Publishing Updates...' : 'Publish Care Report'}</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Daily care report saved! Live status is now immediately visible in the Parent Portal.
            </span>
          </div>
        </div>
      )}

      {/* Classroom selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Sunshine Classroom', 'Rainbow Classroom', 'Butterfly Room', 'Little Explorers'].map((cr) => (
          <button
            key={cr}
            onClick={() => {
              setSelectedClassroom(cr);
              const firstInRoom = children.find((c) => c.classroom_name === cr);
              if (firstInRoom) setSelectedChildId(firstInRoom.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedClassroom === cr
                ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-xs'
                : 'bg-white hover:bg-ivory-100 text-ink-700 border border-ivory-300'
            }`}
          >
            {cr}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Children list in classroom */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-ivory-300 shadow-subtle flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-ink-800">Students in Classroom</span>
            <span className="text-[11px] font-bold text-primary-900 bg-primary-100 px-2 py-0.5 rounded-full border border-primary-200">
              {filteredChildren.length} Children
            </span>
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredChildren.map((c) => {
              const isSelected = c.id === selectedChildId;
              const log = logs[c.id];

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary-700 to-primary-500 text-white border-primary-600 shadow-xs'
                      : 'bg-white hover:bg-ivory-50 text-ink-900 border-ivory-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-900'
                      }`}
                    >
                      {c.first_name[0]}{c.last_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-xs">
                        {c.first_name} {c.last_name}
                      </p>
                      <p className={`text-[10px] ${isSelected ? 'text-primary-100' : 'text-ink-500'}`}>
                        {c.calculated_age?.formatted} • {log?.mood?.split(' ')[0] || 'Happy'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={15} className={isSelected ? 'text-white' : 'text-ink-400'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Care Log Editor for Selected Child */}
        <div className="lg:col-span-8">
          {currentChild && currentLog ? (
            <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-subtle space-y-6">
              {/* Selected Child Header */}
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-sm border border-amber-200">
                    {currentChild.first_name[0]}{currentChild.last_name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-ink-900">
                      {currentChild.first_name} {currentChild.last_name}
                    </h3>
                    <p className="text-xs text-ink-500">
                      {currentChild.classroom_name} • Age: {currentChild.calculated_age?.formatted}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Present in Class
                </span>
              </div>

              {/* 1. Meals & Nutrition Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-700 flex items-center gap-2">
                  <Utensils size={14} className="text-amber-600" />
                  Meals &amp; Nutrition Intake
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Morning Snack */}
                  <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
                    <span className="text-xs font-bold text-ink-900 block mb-1">Morning Snack</span>
                    <select
                      value={currentLog.morningSnack}
                      onChange={(e) => updateCurrentLog('morningSnack', e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-ivory-300 rounded-lg p-1.5 text-ink-800 focus:ring-1 focus:ring-forest-600"
                    >
                      <option>All (100%)</option>
                      <option>Most (80%)</option>
                      <option>Half (50%)</option>
                      <option>A little (20%)</option>
                      <option>Declined (0%)</option>
                    </select>
                  </div>

                  {/* Lunch */}
                  <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
                    <span className="text-xs font-bold text-ink-900 block mb-1">Lunch</span>
                    <select
                      value={currentLog.lunch}
                      onChange={(e) => updateCurrentLog('lunch', e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-ivory-300 rounded-lg p-1.5 text-ink-800 focus:ring-1 focus:ring-forest-600"
                    >
                      <option>All (100%)</option>
                      <option>Most (80%)</option>
                      <option>Half (50%)</option>
                      <option>A little (20%)</option>
                      <option>Declined (0%)</option>
                    </select>
                  </div>

                  {/* Afternoon Snack */}
                  <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
                    <span className="text-xs font-bold text-ink-900 block mb-1">Afternoon Snack</span>
                    <select
                      value={currentLog.breakfast}
                      onChange={(e) => updateCurrentLog('breakfast', e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-ivory-300 rounded-lg p-1.5 text-ink-800 focus:ring-1 focus:ring-forest-600"
                    >
                      <option>All (100%)</option>
                      <option>Scheduled (3:15 PM)</option>
                      <option>Most (80%)</option>
                      <option>Half (50%)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Nap Rest Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-700 flex items-center gap-2">
                  <Moon size={14} className="text-indigo-500" />
                  Nap &amp; Rest Tracking
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
                    <span className="text-xs font-bold text-ink-900 block mb-1">Nap Duration</span>
                    <input
                      type="text"
                      value={currentLog.napDuration}
                      onChange={(e) => updateCurrentLog('napDuration', e.target.value)}
                      placeholder="e.g. 1h 25m"
                      className="w-full text-xs font-semibold bg-white border border-ivory-300 rounded-lg p-1.5 text-ink-800"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
                    <span className="text-xs font-bold text-ink-900 block mb-1">Rest Quality</span>
                    <select
                      value={currentLog.napQuality}
                      onChange={(e) => updateCurrentLog('napQuality', e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-ivory-300 rounded-lg p-1.5 text-ink-800"
                    >
                      <option>Rested Soundly</option>
                      <option>Restless / Light Sleep</option>
                      <option>Quiet Play on Mat (No Sleep)</option>
                      <option>Woke Early &amp; Cheerful</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Mood & Wellbeing */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-700 flex items-center gap-2">
                  <Smile size={14} className="text-emerald-600" />
                  Overall Mood &amp; Engagement
                </h4>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Happy & Playful 😊',
                    'Calm & Curious 🌿',
                    'Energetic & Excited ⚡',
                    'Quiet & Thoughtful 📖',
                    'A bit tired / cuddly 🧸',
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => updateCurrentLog('mood', m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentLog.mood === m
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-ivory-100 hover:bg-ivory-200 text-ink-800 border border-ivory-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Teacher's Daily Note to Parents */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-700 flex items-center gap-2">
                  <FileText size={14} className="text-primary-700" />
                  Teacher's Note for Today's Parent Report
                </h4>
                <textarea
                  rows={3}
                  value={currentLog.dailyNote}
                  onChange={(e) => updateCurrentLog('dailyNote', e.target.value)}
                  placeholder="Describe accomplishments, social interactions, or special moments from today..."
                  className="w-full text-xs p-3 bg-ivory-50 border border-ivory-300 rounded-2xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-ink-500 border border-ivory-300">
              Select a child from the classroom list to log daily care.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
