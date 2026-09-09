import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Baby,
  Calendar,
  Clock,
  Heart,
  AlertTriangle,
  Utensils,
  Moon,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Camera,
  BookOpen,
  Plus,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input, Select } from '../../components/common/Input.js';
import { api } from '../../services/api.js';

interface ChildProfilePageProps {
  childId: string;
  onBack: () => void;
  onNavigateTab?: (path: string) => void;
}

export const ChildProfilePage: React.FC<ChildProfilePageProps> = ({ childId, onBack, onNavigateTab }) => {
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'guardians' | 'pickups' | 'enrollment'>('overview');

  // Add Pickup Modal
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [submittingPickup, setSubmittingPickup] = useState(false);
  const [pickupForm, setPickupForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    notes: '',
  });

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

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-ink-500">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-400 text-white flex items-center justify-center mx-auto mb-3 animate-pulse shadow-md shadow-primary-500/25">
          🫧
        </div>
        <p className="font-semibold text-primary-900">Loading 360° Child Profile...</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="py-16 text-center text-ink-600">
        <p>Child record not found or access unauthorized.</p>
        <Button variant="outline" size="sm" onClick={onBack} className="mt-4">Back to Roster</Button>
      </div>
    );
  }

  const primaryGuardian = child.guardians?.find((g: any) => g.is_primary) || child.guardians?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-800 hover:text-primary-900 hover:underline"
      >
        <ArrowLeft size={15} />
        <span>Back to Children Roster</span>
      </button>

      {/* 360 Header (#8 Specification) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-warm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-ivory-200">
          <div className="flex items-center gap-5">
            {/* Child Photo / Initials */}
            <div className="w-20 h-20 rounded-3xl bg-terracotta-100 text-terracotta-600 font-extrabold text-3xl flex items-center justify-center border-2 border-terracotta-200 shadow-sm shrink-0">
              {child.first_name[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
                  {child.first_name} {child.middle_name ? `${child.middle_name} ` : ''}{child.last_name}
                </h1>
                <Badge variant="success" dot>Present Today</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-ink-600">
                <span className="font-semibold text-forest-800">
                  Age: {child.calculated_age?.formatted}
                </span>
                <span>•</span>
                <span className="font-medium text-ink-700">
                  {child.program_name} — {child.classroom_name || 'Room A-101'}
                </span>
                <span>•</span>
                <span className="text-ink-400 font-mono text-[11px]">
                  ID: {child.admission_number}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Camera size={14} />}
            >
              Gallery (24)
            </Button>
            <Button
              variant="terracotta"
              size="sm"
              icon={<Heart size={14} />}
            >
              Daily Report
            </Button>
          </div>
        </div>

        {/* 6 Useful Summary Cards (#8 Child Profile UI) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Attendance</span>
            <p className="text-xl font-extrabold text-forest-800 mt-0.5">95%</p>
            <span className="text-[10px] text-forest-700">19 / 20 Days</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Development</span>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">82%</p>
            <span className="text-[10px] text-forest-700">14 Milestones</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Activities</span>
            <p className="text-xl font-extrabold text-terracotta-600 mt-0.5">24</p>
            <span className="text-[10px] text-ink-500">Term 1</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Daily Reports</span>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">18</p>
            <span className="text-[10px] text-ink-500">Delivered</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Photos</span>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">124</p>
            <span className="text-[10px] text-ink-500">Shared</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Incidents</span>
            <p className="text-xl font-extrabold text-forest-800 mt-0.5">0</p>
            <span className="text-[10px] text-forest-700">Safe record</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-ivory-300 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'care', label: 'Care & Health Baseline' },
          { id: 'guardians', label: `Parents & Guardians (${child.guardians?.length || 0})` },
          { id: 'pickups', label: `Authorized Pickups (${child.authorized_pickups?.length || 0})` },
          { id: 'enrollment', label: 'Classroom & Placement' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 transition-colors border-b-2 shrink-0 ${
              activeTab === t.id
                ? 'border-forest-800 text-forest-900 font-extrabold'
                : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Early Childhood Identity" subtitle="Demographics and enrollment">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-ivory-200">
                <span className="text-ink-500 font-medium">Full Legal Name</span>
                <span className="font-bold text-ink-900">{child.first_name} {child.middle_name} {child.last_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-200">
                <span className="text-ink-500 font-medium">Date of Birth</span>
                <span className="font-bold text-ink-900">{child.date_of_birth} ({child.calculated_age?.formatted})</span>
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
                <Badge variant="success" size="sm" dot>{child.enrollment_status}</Badge>
              </div>
            </div>
          </Card>

          <Card title="Primary Guardian & Emergency" subtitle="Main contact on file">
            {primaryGuardian ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-forest-900 text-sm">
                      {primaryGuardian.parent_first_name} {primaryGuardian.parent_last_name}
                    </span>
                    <Badge variant="success" size="sm">Primary Guardian</Badge>
                  </div>
                  <p className="text-[11px] text-forest-700 mt-0.5">
                    Relationship: {primaryGuardian.relationship}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-ink-700 pt-1">
                  <Phone size={14} className="text-forest-700" />
                  <span className="font-medium">{primaryGuardian.parent_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <Mail size={14} className="text-forest-700" />
                  <span>{primaryGuardian.parent_email}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <MapPin size={14} className="text-forest-700" />
                  <span>{primaryGuardian.parent_address || 'Addis Ababa, Ethiopia'}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-ink-500 italic">No primary guardian linked.</p>
            )}
          </Card>
        </div>
      )}

      {/* Tab 2: Care & Health Baseline (#7) */}
      {activeTab === 'care' && (
        <div className="space-y-6">
          {/* Allergies Alert Banner */}
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
              {child.medical_notes && (
                <p className="mt-2 text-amber-800 font-medium">
                  <strong>Medical Action / Storage:</strong> {child.medical_notes}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-forest-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-forest-600" />
              <span>No food or environmental allergies reported for {child.first_name}.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Nutrition & Meal Guidelines" subtitle="Dietary preferences and restrictions">
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-ink-900 block">Dietary Restrictions:</span>
                  <p className="text-ink-600 mt-0.5">
                    {child.dietary_restrictions?.length ? child.dietary_restrictions.join(', ') : 'No restrictions'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-ink-900 block">Food Preferences:</span>
                  <p className="text-ink-600 mt-0.5">
                    {child.food_preferences || 'Enjoys standard healthy school menu.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Routines & Toilet Training" subtitle="Daily early childhood support">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-900">Toilet Training Status:</span>
                  <Badge variant="success" size="sm">
                    {child.toilet_training_status?.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <span className="font-bold text-ink-900 block">Nap & Sleep Preferences:</span>
                  <p className="text-ink-600 mt-0.5">
                    {child.nap_preferences || 'Sleeps well in quiet rest area with soft music.'}
                  </p>
                </div>

                {child.other_care_instructions && (
                  <div>
                    <span className="font-bold text-ink-900 block">Special Instructions:</span>
                    <p className="text-ink-600 mt-0.5">{child.other_care_instructions}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Parents & Guardians (#7) */}
      {activeTab === 'guardians' && (
        <Card
          title="Guardians & Emergency Contacts"
          subtitle="Authorized family members"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {child.guardians?.map((g: any) => (
              <div key={g.id} className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-ink-900 text-sm">
                      {g.parent_first_name} {g.parent_last_name}
                    </p>
                    <p className="text-forest-700 font-medium text-[11px]">{g.relationship}</p>
                  </div>
                  {g.is_primary && <Badge variant="success" size="sm">Primary</Badge>}
                </div>

                <div className="pt-2 border-t border-ivory-200 space-y-1 text-ink-600">
                  <p><strong>Phone:</strong> {g.parent_phone}</p>
                  <p><strong>Email:</strong> {g.parent_email}</p>
                  <p><strong>Occupation:</strong> {g.parent_occupation || '—'}</p>
                  <p><strong>Pickup Authorized:</strong> {g.pickup_authorized ? '✓ Yes' : '✕ No'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Authorized Pickups (#7 & #14 Security Rule: Never allow unauthorized pickup) */}
      {activeTab === 'pickups' && (
        <Card
          title="Authorized Pickup Register"
          subtitle="Strict security list for child departure"
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
                    isApproved
                      ? 'bg-primary-50/70 border-primary-200'
                      : 'bg-dustyrose-50/70 border-dustyrose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                        isApproved ? 'bg-gradient-to-tr from-primary-700 to-primary-500 text-white' : 'bg-dustyrose-500 text-white'
                      }`}
                    >
                      {isApproved ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink-900 text-sm">{p.name}</span>
                        <Badge variant={isApproved ? 'success' : 'danger'} size="sm">
                          {isApproved ? 'Approved Pickup' : 'Revoked — Do Not Release'}
                        </Badge>
                      </div>
                      <p className="text-ink-600 mt-0.5">
                        Relationship: {p.relationship} • Phone: {p.phone}
                      </p>
                      {p.notes && <p className="text-[11px] text-ink-500 italic mt-0.5">Note: {p.notes}</p>}
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
      )}

      {/* Tab 5: Classroom & Placement */}
      {activeTab === 'enrollment' && (
        <Card title="Classroom & Educational Program" subtitle="Early years placement">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
              <span className="text-ink-500">Program</span>
              <p className="text-base font-bold text-ink-900 mt-1">{child.program_name}</p>
              <p className="text-[11px] text-forest-700 mt-1 font-semibold">Preschool Level (KG 1)</p>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
              <span className="text-ink-500">Assigned Classroom</span>
              <p className="text-base font-bold text-ink-900 mt-1">{child.classroom_name}</p>
              <p className="text-[11px] text-ink-500 mt-1">Room {child.classroom_room_number || 'A-101'}</p>
            </div>
          </div>
        </Card>
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
            placeholder="e.g. Tuesdays & Fridays, or emergency backup only"
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
