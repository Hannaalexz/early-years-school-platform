import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Baby,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Camera,
  BookOpen,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Heart
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { api } from '../../services/api.js';

interface ChildProfilePageProps {
  childId: string;
  onBack: () => void;
  onNavigateTab?: (path: string) => void;
}

type TabType =
  | 'overview'
  | 'attendance'
  | 'development'
  | 'activities'
  | 'photos'
  | 'notes'
  | 'health'
  | 'parents';

export const ChildProfilePage: React.FC<ChildProfilePageProps> = ({
  childId,
  onBack,
  onNavigateTab,
}) => {
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Add Pickup Modal
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [submittingPickup, setSubmittingPickup] = useState(false);
  const [pickupForm, setPickupForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    notes: '',
  });

  // Notes state
  const [notesList, setNotesList] = useState<
    { id: string; text: string; author: string; date: string }[]
  >([
    {
      id: 'n-1',
      text: 'Emma settled in smoothly today. Very cooperative during cleanup time.',
      author: 'Teacher Helen',
      date: 'Sep 15, 2026',
    },
    {
      id: 'n-2',
      text: 'Loves water play station; recommend keeping an extra change of clothes in cubby.',
      author: 'Teacher Helen',
      date: 'Sep 10, 2026',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  const loadChildData = async () => {
    setLoading(true);
    const res = await api.getChild(childId);
    setLoading(false);
    if (res.success && res.data) {
      setChild(res.data);
    }
  };

  useEffect(() => {
    loadChildData();
  }, [childId]);

  const handleAddPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPickup(true);
    const res = await api.addAuthorizedPickup(childId, pickupForm);
    setSubmittingPickup(false);
    if (res.success) {
      setShowPickupModal(false);
      setPickupForm({ name: '', relationship: '', phone: '', notes: '' });
      loadChildData();
    }
  };

  const handleTogglePickupStatus = async (pickupId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'revoked' : 'approved';
    const res = await api.updatePickupStatus(childId, pickupId, nextStatus);
    if (res.success) {
      loadChildData();
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setNotesList([
      {
        id: `note-${Date.now()}`,
        text: newNoteText,
        author: 'Staff Member',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
      ...notesList,
    ]);
    setNewNoteText('');
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-ink-500">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#20BDB2] to-[#38D3C7] text-white flex items-center justify-center mx-auto mb-3 animate-pulse shadow-md">
          🫧
        </div>
        <p className="font-bold text-[#0B4E49]">Loading Child Profile...</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="py-16 text-center text-ink-600">
        <p>Child record not found.</p>
        <Button variant="outline" size="sm" onClick={onBack} className="mt-4">
          Back to Roster
        </Button>
      </div>
    );
  }

  const primaryGuardian = child.guardians?.find((g: any) => g.is_primary) || child.guardians?.[0];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '1. Overview' },
    { id: 'attendance', label: '2. Attendance' },
    { id: 'development', label: '3. Development' },
    { id: 'activities', label: '4. Activities' },
    { id: 'photos', label: '5. Photos' },
    { id: 'notes', label: '6. Notes' },
    { id: 'health', label: '7. Health & Safety' },
    { id: 'parents', label: '8. Parents & Pickups' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4E49] hover:text-[#21B8AF] hover:underline"
      >
        <ArrowLeft size={15} />
        <span>Back to Children Roster</span>
      </button>

      {/* Clean Child Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-ivory-200">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#E0F7F4] text-[#0B4E49] font-extrabold text-3xl flex items-center justify-center border-2 border-[#C3EFEB] shadow-sm shrink-0 font-['Baloo_2']">
              {child.first_name[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight font-['Baloo_2']">
                  {child.first_name} {child.middle_name ? `${child.middle_name} ` : ''}
                  {child.last_name}
                </h1>
                <Badge variant="success" dot>
                  At School Today
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-ink-600">
                <span className="font-semibold text-[#0B4E49]">
                  Age: {child.calculated_age?.formatted}
                </span>
                <span>•</span>
                <span className="font-medium text-ink-700">
                  {child.classroom_name || 'Sunshine Classroom'} ({child.program_name || 'Preschool'})
                </span>
                <span>•</span>
                <span className="text-ink-400 font-mono text-[11px]">
                  Admission: {child.admission_number}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('/development/monthly-progress');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] hover:from-[#1BA49A] hover:to-[#29BCB1] text-white text-xs font-bold shadow-xs transition"
            >
              <Sparkles size={14} />
              <span>Monthly Progress</span>
            </button>
          </div>
        </div>

        {/* 4 Focused Key Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
              Monthly Attendance
            </span>
            <p className="text-xl font-extrabold text-[#0B4E49] mt-0.5">20 / 22</p>
            <span className="text-[10px] text-emerald-700">91% present</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
              Development
            </span>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">6 Domains</p>
            <span className="text-[10px] text-[#21B8AF]">Report Published</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
              Activities Logged
            </span>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">14</p>
            <span className="text-[10px] text-ink-500">This Month</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
              Safety Record
            </span>
            <p className="text-xl font-extrabold text-emerald-800 mt-0.5">0 Incidents</p>
            <span className="text-[10px] text-emerald-700">Safe &amp; Protected</span>
          </div>
        </div>
      </div>

      {/* 8 Tabs Navigation (Section 20) */}
      <div className="flex border-b border-ivory-300 gap-1.5 overflow-x-auto text-xs font-bold pb-0.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`py-2 px-3 rounded-xl transition border shrink-0 ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-[#20BDB2] to-[#38D3C7] text-white border-transparent shadow-xs'
                : 'bg-white text-ink-600 border-ivory-200 hover:bg-ivory-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Demographics & Identity" subtitle="Official registration">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-ivory-200">
                <span className="text-ink-500 font-medium">Full Name</span>
                <span className="font-bold text-ink-900">
                  {child.first_name} {child.middle_name} {child.last_name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-200">
                <span className="text-ink-500 font-medium">Date of Birth</span>
                <span className="font-bold text-ink-900">
                  {child.date_of_birth} ({child.calculated_age?.formatted})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-200">
                <span className="text-ink-500 font-medium">Gender</span>
                <span className="font-bold text-ink-900">{child.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-200">
                <span className="text-ink-500 font-medium">Admission Date</span>
                <span className="font-bold text-ink-900">{child.admission_date}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-ink-500 font-medium">Enrollment Status</span>
                <Badge variant="success" size="sm" dot>
                  {child.enrollment_status}
                </Badge>
              </div>
            </div>
          </Card>

          <Card title="Classroom & Program" subtitle="Early childhood placement">
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB]">
                <span className="text-ink-500 font-medium">Classroom</span>
                <p className="text-base font-extrabold text-[#0B4E49] mt-0.5">
                  {child.classroom_name || 'Sunshine Classroom'}
                </p>
                <p className="text-[11px] text-ink-500 mt-0.5">
                  Room: {child.classroom_room_number || 'A-101'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200">
                <span className="text-ink-500 font-medium">Educational Program</span>
                <p className="text-sm font-bold text-ink-900 mt-0.5">
                  {child.program_name || 'Preschool (KG 1)'}
                </p>
                <p className="text-[11px] text-ink-500 mt-0.5">Focus: Play-based learning</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <Card title="Monthly Attendance Log" subtitle="Arrival, departure, and pickup verification">
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0B4E49] text-sm">Today's Presence</p>
                <p className="text-[11px] text-ink-600 mt-0.5">
                  Arrived at 08:45 AM • Handed over by Mother (Sarah Johnson)
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
                ✓ Present
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-100 text-ink-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Arrival</th>
                    <th className="p-2.5">Dropped Off By</th>
                    <th className="p-2.5">Departure</th>
                    <th className="p-2.5">Picked Up By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  <tr>
                    <td className="p-2.5 font-bold">Sep 16, 2026</td>
                    <td className="p-2.5 text-emerald-700 font-bold">Present</td>
                    <td className="p-2.5">08:45 AM</td>
                    <td className="p-2.5">Sarah Johnson (Mother)</td>
                    <td className="p-2.5">In class</td>
                    <td className="p-2.5 text-ink-400">—</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Sep 15, 2026</td>
                    <td className="p-2.5 text-emerald-700 font-bold">Present</td>
                    <td className="p-2.5">08:50 AM</td>
                    <td className="p-2.5">David Johnson (Father)</td>
                    <td className="p-2.5">03:30 PM</td>
                    <td className="p-2.5 font-bold">Sarah Johnson (✓ Authorized)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Sep 14, 2026</td>
                    <td className="p-2.5 text-emerald-700 font-bold">Present</td>
                    <td className="p-2.5">08:40 AM</td>
                    <td className="p-2.5">Sarah Johnson (Mother)</td>
                    <td className="p-2.5">03:35 PM</td>
                    <td className="p-2.5 font-bold">Eleanor Johnson (✓ Grandmother)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Sep 11, 2026</td>
                    <td className="p-2.5 text-dustyrose-700 font-bold">Absent</td>
                    <td className="p-2.5">--:--</td>
                    <td className="p-2.5 text-ink-400">Resting at home</td>
                    <td className="p-2.5">--:--</td>
                    <td className="p-2.5 text-ink-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: DEVELOPMENT */}
      {activeTab === 'development' && (
        <Card title="Early Years Developmental Progress" subtitle="6 Core Domains (Emerging, Developing, Achieved)">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { domain: 'Cognitive', status: 'Achieved', note: 'Sorts objects by size and counts to 10 with 1-to-1 correspondence.' },
                { domain: 'Language & Communication', status: 'Developing', note: 'Expresses complex ideas clearly; loves retelling circle time stories.' },
                { domain: 'Social & Emotional', status: 'Achieved', note: 'Shares toys willingly and shows empathy when classmates need comforting.' },
                { domain: 'Physical', status: 'Developing', note: 'Gross motor is agile; fine motor scissor cutting is advancing nicely.' },
                { domain: 'Creative', status: 'Achieved', note: 'Explores watercolors freely; engages in rich imaginative pretend play.' },
                { domain: 'Early Literacy', status: 'Developing', note: 'Recognizes own written name and points to initial letter sounds.' },
              ].map((d) => (
                <div key={d.domain} className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink-900">{d.domain}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-600 leading-relaxed italic">"{d.note}"</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: ACTIVITIES */}
      {activeTab === 'activities' && (
        <Card title="Classroom Learning Activities" subtitle="Participated sensory and play sessions">
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B4E49]">Finger Painting &amp; Color Mixing</span>
                <span className="text-[10px] text-ink-500 font-mono">Sep 16, 2026</span>
              </div>
              <p className="text-[11px] text-[#13615B] mt-1">
                Explored blue and yellow paint blending; created emerald green swirls on group paper.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-900">Story Circle: The Very Hungry Caterpillar</span>
                <span className="text-[10px] text-ink-500 font-mono">Sep 15, 2026</span>
              </div>
              <p className="text-[11px] text-ink-600 mt-1">
                Participated enthusiastically in retelling the fruits in order with felt props.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: PHOTOS */}
      {activeTab === 'photos' && (
        <Card title="Moments &amp; Media Gallery" subtitle="Securely shared moments">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { title: 'Block Castle Construction', date: 'Sep 15' },
              { title: 'Watercolor Mixing', date: 'Sep 14' },
              { title: 'Outdoor Leaf Hunt', date: 'Sep 12' },
            ].map((p, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-ivory-200 bg-ivory-50 p-2 text-xs">
                <div className="aspect-4/3 rounded-xl bg-gradient-to-br from-[#E0F7F4] to-[#C3EFEB] flex items-center justify-center text-2xl">
                  📸
                </div>
                <p className="font-bold text-ink-900 mt-2">{p.title}</p>
                <p className="text-[10px] text-ink-500">{p.date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 6: NOTES */}
      {activeTab === 'notes' && (
        <Card title="Internal Teacher Notes" subtitle="Anecdotes and teacher observations">
          <div className="space-y-4 text-xs">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a quick internal observation note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#21B8AF]"
              />
              <Button type="submit" variant="primary" size="sm">
                Add Note
              </Button>
            </form>

            <div className="space-y-2">
              {notesList.map((n) => (
                <div key={n.id} className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-ink-500">
                    <span className="font-bold text-ink-800">{n.author}</span>
                    <span className="font-mono">{n.date}</span>
                  </div>
                  <p className="text-ink-700 leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 7: HEALTH & SAFETY */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          {child.allergies && child.allergies.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <AlertTriangle size={18} className="text-amber-600" />
                <span>Allergies Recorded on File</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {child.allergies.map((a: string) => (
                  <span key={a} className="px-2.5 py-1 rounded-lg bg-amber-200/80 font-bold text-amber-900 text-xs">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F0FBF9] border border-[#C3EFEB] text-[#0B4E49] text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#21B8AF]" />
              <span>No allergies or dietary restrictions recorded.</span>
            </div>
          )}

          <Card title="Incident & First Aid History" subtitle="School health logs">
            <p className="text-xs text-ink-500 italic">No incidents recorded for this term. Zero first aid interventions required.</p>
          </Card>
        </div>
      )}

      {/* TAB 8: PARENTS & PICKUPS */}
      {activeTab === 'parents' && (
        <div className="space-y-6">
          <Card title="Parents &amp; Legal Guardians" subtitle="Family contacts on file">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {child.guardians?.map((g: any) => (
                <div key={g.id} className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-ink-900 text-sm">
                        {g.parent_first_name} {g.parent_last_name}
                      </p>
                      <p className="text-[#0B4E49] font-medium text-[11px]">{g.relationship}</p>
                    </div>
                    {g.is_primary && <Badge variant="success" size="sm">Primary</Badge>}
                  </div>
                  <div className="pt-2 border-t border-ivory-200 space-y-1 text-ink-600">
                    <p><strong>Phone:</strong> {g.parent_phone}</p>
                    <p><strong>Email:</strong> {g.parent_email}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Authorized Pickup Register"
            subtitle="Strict list of adults approved to pick up this child"
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setShowPickupModal(true)}
              >
                Add Authorized Pickup
              </Button>
            }
          >
            <div className="space-y-3">
              {child.authorized_pickups?.map((p: any) => {
                const isApproved = p.authorization_status === 'approved';
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                      isApproved ? 'bg-[#F0FBF9] border-[#C3EFEB]' : 'bg-dustyrose-50 border-dustyrose-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                          isApproved ? 'bg-gradient-to-tr from-[#20BDB2] to-[#38D3C7] text-white' : 'bg-dustyrose-500 text-white'
                        }`}
                      >
                        {isApproved ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink-900 text-sm">{p.name}</span>
                          <Badge variant={isApproved ? 'success' : 'danger'} size="sm">
                            {isApproved ? '✓ Approved Pickup' : '✕ Revoked'}
                          </Badge>
                        </div>
                        <p className="text-ink-600 mt-0.5">
                          Relationship: {p.relationship} • Phone: {p.phone}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={isApproved ? 'danger' : 'secondary'}
                      size="sm"
                      onClick={() => handleTogglePickupStatus(p.id, p.authorization_status)}
                    >
                      {isApproved ? 'Revoke Rights' : 'Re-Approve'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Add Authorized Pickup Modal */}
      <Modal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        title="Register Authorized Pickup Person"
        subtitle={`Approve an adult authorized to pick up ${child.first_name}`}
      >
        <form onSubmit={handleAddPickup} className="space-y-4">
          <Input
            label="Full Legal Name"
            placeholder="e.g. Eleanor Johnson"
            value={pickupForm.name}
            onChange={(e) => setPickupForm({ ...pickupForm, name: e.target.value })}
            required
          />
          <Input
            label="Relationship to Child"
            placeholder="e.g. Grandmother, Aunt, Family Friend"
            value={pickupForm.relationship}
            onChange={(e) => setPickupForm({ ...pickupForm, relationship: e.target.value })}
            required
          />
          <Input
            label="Contact Phone Number"
            placeholder="+251 91 100 0000"
            value={pickupForm.phone}
            onChange={(e) => setPickupForm({ ...pickupForm, phone: e.target.value })}
            required
          />
          <Input
            label="Pickup Notes / Permitted Days"
            placeholder="e.g. Fridays only"
            value={pickupForm.notes}
            onChange={(e) => setPickupForm({ ...pickupForm, notes: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPickupModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submittingPickup}
            >
              Save Authorization
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
