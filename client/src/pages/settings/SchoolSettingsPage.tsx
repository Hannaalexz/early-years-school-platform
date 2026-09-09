import React, { useState } from 'react';
import { Building2, MapPin, Calendar, BookOpen, Users, CheckCircle, Save } from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';
import { useSchool } from '../../context/SchoolContext.js';
import { api } from '../../services/api.js';

export const SchoolSettingsPage: React.FC = () => {
  const { school, campuses, programs, classrooms, currentAcademicYear, refreshSchool } = useSchool();
  const [formData, setFormData] = useState({
    name: school?.name || 'Little Stars Early Years School',
    tagline: school?.tagline || 'Nurturing Curious Minds from 1 to 6 Years Old',
    address: school?.address || 'Bole Subcity, Woreda 03, Near Atlas Hotel',
    city: school?.city || 'Addis Ababa',
    phone: school?.phone || '+251 11 661 2345',
    email: school?.email || 'contact@littlestars.edu',
    currency: school?.currency || 'ETB',
    website: school?.website || 'https://littlestars.edu',
  });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(false);
    const res = await api.updateSchool(formData);
    setSaving(false);
    if (res.success) {
      setSavedMessage(true);
      refreshSchool();
      setTimeout(() => setSavedMessage(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-ink-900">School & Campus Settings</h2>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Configure educational organization details, campuses, programs, and classroom structures.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-sage-100 border border-sage-200 text-forest-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle size={16} className="text-forest-700" />
          <span>School profile details successfully updated and saved to PostgreSQL.</span>
        </div>
      )}

      {/* School Profile Form */}
      <Card title="Organization Identity" subtitle="Core school profile information">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="School Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Tagline / Motto"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Official Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Billing Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Physical Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              icon={<Save size={15} />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Campuses & Academic Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Campuses (#4 Multi-School)" subtitle="Registered physical sites">
          <div className="space-y-3">
            {campuses.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-900">{c.name}</span>
                  {c.is_main && <Badge variant="success" size="sm">Main Campus</Badge>}
                </div>
                <p className="text-ink-500 mt-1">{c.address || c.city}</p>
                <p className="text-[10px] text-forest-700 font-mono mt-0.5">Code: {c.code}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Academic Calendar" subtitle="Active academic session">
          <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-900 text-sm">
                {currentAcademicYear?.name || '2026 - 2027 Academic Year'}
              </span>
              <Badge variant="success" size="sm">Current</Badge>
            </div>
            <p className="text-ink-600">
              Dates: {currentAcademicYear?.start_date || '2026-09-01'} to {currentAcademicYear?.end_date || '2027-06-30'}
            </p>
            <p className="text-[11px] text-forest-700">
              Status: Term 1 in progress. 4 Classrooms enrolled.
            </p>
          </div>
        </Card>
      </div>

      {/* Early Years Programs Table */}
      <Card title="Educational Programs (Ages 1–6)" subtitle="Configured early development programs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ivory-200 text-ink-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3">Program</th>
                <th className="pb-3">Age Range</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {programs.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-bold text-ink-900">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                      style={{ backgroundColor: p.color_code }}
                    />
                    {p.name}
                  </td>
                  <td className="py-3 text-ink-600">
                    {p.age_group_min_months}–{p.age_group_max_months} months ({Math.floor(p.age_group_min_months / 12)}–{Math.ceil(p.age_group_max_months / 12)} yrs)
                  </td>
                  <td className="py-3 text-ink-500 max-w-xs truncate">{p.description}</td>
                  <td className="py-3 text-right">
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
