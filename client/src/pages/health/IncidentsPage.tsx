import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Phone,
  AlertTriangle,
  User,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';
import { Pagination } from '../../components/common/Pagination.js';

interface Incident {
  id: string;
  childId: string;
  childName: string;
  classroom: string;
  date: string;
  time: string;
  location: string;
  description: string;
  actionTaken: string;
  parentNotified: boolean;
  parentNotifiedAt?: string;
  staffName: string;
  severity: 'minor' | 'moderate' | 'serious';
}

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    childId: 'c2',
    childName: 'Lucas Miller',
    classroom: 'Sunshine Classroom',
    date: 'Sep 15, 2026',
    time: '10:35 AM',
    location: 'Outdoor Playground (Grass hill)',
    description: 'Lucas tripped while running during outdoor play and scraped his right knee.',
    actionTaken: 'Washed with clean water and gentle antiseptic wipe. Applied a fun dinosaur adhesive bandage and cold compress. Child rested 5 minutes and happily returned to group play.',
    parentNotified: true,
    parentNotifiedAt: '10:45 AM via Phone Call',
    staffName: 'Teacher Helen Brooks',
    severity: 'minor',
  },
  {
    id: 'inc-2',
    childId: 'c4',
    childName: 'Maya Patel',
    classroom: 'Rainbow Classroom',
    date: 'Sep 08, 2026',
    time: '02:15 PM',
    location: 'Indoor Block Center',
    description: 'Minor bump to left forearm when reaching into a wooden shelf.',
    actionTaken: 'Cold compress applied for 10 minutes. No swelling or skin break observed. Comforted by caregiver.',
    parentNotified: true,
    parentNotifiedAt: '02:30 PM via Portal Note',
    staffName: 'Teacher Sarah Vance',
    severity: 'minor',
  },
];

export const IncidentsPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // Form State
  const [formChildId, setFormChildId] = useState('');
  const [formLocation, setFormLocation] = useState('Outdoor Playground');
  const [formSeverity, setFormSeverity] = useState<'minor' | 'moderate' | 'serious'>('minor');
  const [formDescription, setFormDescription] = useState('');
  const [formActionTaken, setFormActionTaken] = useState('');
  const [formParentNotified, setFormParentNotified] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    const res = await api.getChildren();
    if (res.success && res.data) {
      setChildren(res.data);
      if (res.data.length > 0) setFormChildId(res.data[0].id);
    }
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const ch = children.find((c) => c.id === formChildId) || children[0];
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      childId: ch ? ch.id : 'unknown',
      childName: ch ? `${ch.first_name} ${ch.last_name}` : 'Unknown Child',
      classroom: ch ? ch.classroom_name || 'Sunshine Classroom' : 'Sunshine Classroom',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: formLocation,
      description: formDescription,
      actionTaken: formActionTaken,
      parentNotified: formParentNotified,
      parentNotifiedAt: formParentNotified ? 'Logged upon recording' : undefined,
      staffName: 'Staff Member on Duty',
      severity: formSeverity,
    };

    setIncidents([newInc, ...incidents]);
    setShowAddModal(false);
    setFormDescription('');
    setFormActionTaken('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900 font-['Baloo_2']">
              Incident &amp; First Aid Logs
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Safe Care Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Log immediate first aid, scrape/bump occurrences, actions taken, and documented parent notification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-dustyrose-600 to-terracotta-600 hover:from-dustyrose-700 hover:to-terracotta-700 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus size={15} />
          <span>Record New Incident</span>
        </button>
      </div>

      {/* Incidents Feed */}
      <div className="space-y-4">
        {incidents
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
          .map((inc) => (
          <div
            key={inc.id}
            className="bg-white rounded-3xl p-5 border border-ivory-300 shadow-xs hover:border-ivory-400 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-ivory-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center border border-amber-200">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-ink-900">{inc.childName}</h3>
                  <p className="text-[11px] text-ink-500">
                    {inc.classroom} • {inc.date} at {inc.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-600 bg-ivory-100 px-2.5 py-1 rounded-xl border border-ivory-200">
                  <MapPin size={12} className="text-ink-500" /> {inc.location}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                    inc.severity === 'minor'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-dustyrose-100 text-dustyrose-800 border-dustyrose-200'
                  }`}
                >
                  {inc.severity}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-1">
                <span className="font-bold text-ink-900 block">Incident Description:</span>
                <p className="text-ink-700 leading-relaxed">{inc.description}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] space-y-1">
                <span className="font-bold text-[#0B4E49] block">First Aid &amp; Action Taken:</span>
                <p className="text-[#13615B] leading-relaxed">{inc.actionTaken}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-ivory-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-ink-500">Parent Notified:</span>
                {inc.parentNotified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    <CheckCircle2 size={12} /> Yes ({inc.parentNotifiedAt})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-dustyrose-800 bg-dustyrose-100 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    <XCircle size={12} /> Pending Notification
                  </span>
                )}
              </div>

              <p className="text-ink-400 text-[11px]">
                Recorded by: <strong className="text-ink-700">{inc.staffName}</strong>
              </p>
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalItems={incidents.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[4, 8, 12]}
          itemLabel="incident records"
        />
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <h3 className="text-sm font-extrabold text-ink-900">Record Incident / First Aid</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-ink-400 hover:text-ink-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddIncident} className="space-y-3 text-xs">
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
                <label className="block font-bold text-ink-700 mb-1">Location on Campus</label>
                <input
                  type="text"
                  placeholder="e.g. Playground, Sandpit, Art Corner"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Severity Level</label>
                <select
                  value={formSeverity}
                  onChange={(e) => setFormSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                >
                  <option value="minor">Minor (Scrape, bump, brief tear)</option>
                  <option value="moderate">Moderate (Dressing required, ice pack)</option>
                  <option value="serious">Serious (Doctor referral needed)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Incident Description</label>
                <textarea
                  rows={2}
                  placeholder="What occurred..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">First Aid / Action Taken</label>
                <textarea
                  rows={2}
                  placeholder="Cleaned, bandaged, comforted..."
                  value={formActionTaken}
                  onChange={(e) => setFormActionTaken(e.target.value)}
                  className="w-full p-3 bg-ivory-50 border border-ivory-300 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="parentNotifiedCheck"
                  checked={formParentNotified}
                  onChange={(e) => setFormParentNotified(e.target.checked)}
                  className="rounded text-[#21B8AF] focus:ring-[#21B8AF]"
                />
                <label htmlFor="parentNotifiedCheck" className="font-bold text-ink-800">
                  Parent has been notified (via phone or at pickup)
                </label>
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
                  className="px-4 py-2 rounded-xl bg-dustyrose-600 hover:bg-dustyrose-700 text-white font-bold transition shadow-sm"
                >
                  Save Incident Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
