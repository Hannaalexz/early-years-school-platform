import React, { useEffect, useState } from 'react';
import {
  Baby,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Heart,
  Moon,
  Calendar,
  Eye,
  CheckCircle2,
  LayoutGrid,
  List
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';
import { Input, Select } from '../../components/common/Input.js';
import { Modal } from '../../components/common/Modal.js';
import { Pagination } from '../../components/common/Pagination.js';
import { api } from '../../services/api.js';

interface AllChildrenPageProps {
  onSelectChild: (childId: string) => void;
}

export const AllChildrenPage: React.FC<AllChildrenPageProps> = ({ onSelectChild }) => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classroomFilter, setClassroomFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [allergyFilter, setAllergyFilter] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  // Register Child Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState('');

  const [newChild, setNewChild] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    preferred_name: '',
    date_of_birth: '2022-06-15',
    gender: 'Female',
    classroom_id: '',
    program_id: '',
    allergies: '',
    dietary_restrictions: '',
    food_preferences: '',
    nap_preferences: '',
    toilet_training_status: 'in_training',
    medical_notes: '',
  });

  const loadChildren = async () => {
    setLoading(true);
    const res = await api.getChildren({
      classroom_id: classroomFilter || undefined,
      program_id: programFilter || undefined,
      search: search || undefined,
      has_allergy: allergyFilter || undefined,
    });
    setLoading(false);
    if (res.success && res.data) {
      setChildren(res.data);
    }
  };

  useEffect(() => {
    Promise.all([api.getClassrooms(), api.getPrograms()]).then(([cRes, pRes]) => {
      if (cRes.success && cRes.data) setClassrooms(cRes.data);
      if (pRes.success && pRes.data) setPrograms(pRes.data);
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    loadChildren();
  }, [classroomFilter, programFilter, allergyFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadChildren();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setSubmitting(true);

    const payload = {
      ...newChild,
      allergies: newChild.allergies ? newChild.allergies.split(',').map((s) => s.trim()) : [],
      dietary_restrictions: newChild.dietary_restrictions ? newChild.dietary_restrictions.split(',').map((s) => s.trim()) : [],
      gender: newChild.gender as any,
      toilet_training_status: newChild.toilet_training_status as any,
    };

    const res = await api.createChild(payload);
    setSubmitting(false);

    if (res.success) {
      setShowRegisterModal(false);
      loadChildren();
    } else {
      setRegError(res.message || 'Failed to register child.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Register Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink-900 tracking-tight">Children Directory</h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Active early-years children roster (Ages 1–6) across all classrooms.
          </p>
        </div>

        <Button
          variant="terracotta"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => setShowRegisterModal(true)}
        >
          Register Child
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search by child name, admission #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Classroom filter */}
          <select
            value={classroomFilter}
            onChange={(e) => setClassroomFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="">All Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Program filter */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Allergy filter pill */}
          <button
            type="button"
            onClick={() => setAllergyFilter(!allergyFilter)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              allergyFilter
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                : 'bg-ivory-50 border border-ivory-300 text-ink-600 hover:bg-ivory-100'
            }`}
          >
            <AlertTriangle size={13} className={allergyFilter ? 'text-amber-700' : 'text-ink-400'} />
            <span>Allergy Alerts</span>
          </button>

          {/* View toggle */}
          <div className="flex items-center p-1 bg-ivory-100 rounded-xl border border-ivory-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white text-forest-900 shadow-xs' : 'text-ink-400'}`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white text-forest-900 shadow-xs' : 'text-ink-400'}`}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Children Count Header */}
      <div className="flex items-center justify-between text-xs text-ink-500 px-1">
        <span>Showing <strong className="text-ink-900">{children.length}</strong> children</span>
        {allergyFilter && (
          <span className="text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle size={12} /> Filtered: Showing only children with recorded medical/food alerts
          </span>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {children.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((child) => (
              <div
                key={child.id}
                onClick={() => onSelectChild(child.id)}
                className="bg-white rounded-3xl p-5 border border-ivory-300 shadow-subtle hover:border-forest-600 hover:shadow-warm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Card Top: Photo/Initials + Program Tag */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta-600 font-extrabold text-xl flex items-center justify-center border border-terracotta-200 shadow-xs group-hover:scale-105 transition-transform">
                      {child.first_name[0]}
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${child.program_color || '#4A6B53'}15`,
                        color: child.program_color || '#4A6B53',
                      }}
                    >
                      {child.program_name || 'Early Years'}
                    </span>
                  </div>

                  {/* Child Name & Age (#8 Specification) */}
                  <div className="mt-3">
                    <h3 className="font-extrabold text-base text-ink-900 group-hover:text-forest-800 transition-colors">
                      {child.first_name} {child.middle_name ? `${child.middle_name[0]}. ` : ''}{child.last_name}
                    </h3>
                    {child.preferred_name && child.preferred_name !== child.first_name && (
                      <p className="text-[11px] text-ink-400 italic">"{child.preferred_name}"</p>
                    )}
                    <p className="text-xs font-semibold text-forest-700 mt-1">
                      Age: {child.calculated_age?.formatted}
                    </p>
                    <p className="text-[11px] text-ink-500 mt-0.5">
                      {child.classroom_name || 'Unassigned Room'}
                    </p>
                  </div>

                  {/* Care & Allergy Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {child.allergies && child.allergies.length > 0 ? (
                      child.allergies.map((a: string) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold"
                        >
                          <AlertTriangle size={10} className="text-amber-600" />
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-sage-600 font-medium">✓ No allergies</span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Toilet Status + Action CTA */}
                <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-ink-400 capitalize">
                    Toilet: {child.toilet_training_status?.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-bold text-forest-800 group-hover:underline flex items-center gap-1">
                    Profile <Eye size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={children.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[8, 12, 24]}
            itemLabel="children"
          />
        </div>
      ) : (
        /* Table View */
        <div className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-ivory-200 text-ink-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="pb-3">Child</th>
                    <th className="pb-3">Age</th>
                    <th className="pb-3">Classroom</th>
                    <th className="pb-3">Program</th>
                    <th className="pb-3">Allergies / Diet</th>
                    <th className="pb-3">Toilet Training</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {children.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => onSelectChild(c.id)}
                      className="hover:bg-ivory-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 font-bold text-ink-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-terracotta-100 text-terracotta-700 font-extrabold text-xs flex items-center justify-center">
                            {c.first_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-ink-900">{c.first_name} {c.last_name}</p>
                            <p className="text-[10px] text-ink-400">{c.admission_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-forest-800 font-semibold">{c.calculated_age?.formatted}</td>
                      <td className="py-3 text-ink-700">{c.classroom_name}</td>
                      <td className="py-3 text-ink-500">{c.program_name}</td>
                      <td className="py-3">
                        {c.allergies?.length ? (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                            ⚠ {c.allergies.join(', ')}
                          </span>
                        ) : (
                          <span className="text-ink-400 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="py-3 capitalize text-ink-600">{c.toilet_training_status?.replace('_', ' ')}</td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm">View 360°</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination
            currentPage={currentPage}
            totalItems={children.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[8, 12, 24]}
            itemLabel="children"
          />
        </div>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Register Early Years Child"
        subtitle="Complete profile & care baseline"
        maxWidth="xl"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          {regError && (
            <div className="p-3.5 rounded-xl bg-dustyrose-50 border border-dustyrose-200 text-dustyrose-600 text-xs font-medium">
              {regError}
            </div>
          )}

          <div className="p-3 bg-sage-50 rounded-xl border border-sage-200 text-xs font-bold text-forest-900">
            1. Identity & Placement
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="First Name"
              value={newChild.first_name}
              onChange={(e) => setNewChild({ ...newChild, first_name: e.target.value })}
              required
            />
            <Input
              label="Middle Name"
              value={newChild.middle_name}
              onChange={(e) => setNewChild({ ...newChild, middle_name: e.target.value })}
            />
            <Input
              label="Last Name"
              value={newChild.last_name}
              onChange={(e) => setNewChild({ ...newChild, last_name: e.target.value })}
              required
            />
            <Input
              label="Preferred / Nickname"
              value={newChild.preferred_name}
              onChange={(e) => setNewChild({ ...newChild, preferred_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input
              label="Date of Birth"
              type="date"
              value={newChild.date_of_birth}
              onChange={(e) => setNewChild({ ...newChild, date_of_birth: e.target.value })}
              required
            />
            <Select
              label="Gender"
              value={newChild.gender}
              onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}
              options={[
                { label: 'Female', value: 'Female' },
                { label: 'Male', value: 'Male' },
                { label: 'Other', value: 'Other' },
              ]}
            />
            <Select
              label="Program"
              value={newChild.program_id}
              onChange={(e) => setNewChild({ ...newChild, program_id: e.target.value })}
              options={[
                { label: 'Select Program...', value: '' },
                ...programs.map((p) => ({ label: p.name, value: p.id })),
              ]}
            />
            <Select
              label="Classroom"
              value={newChild.classroom_id}
              onChange={(e) => setNewChild({ ...newChild, classroom_id: e.target.value })}
              options={[
                { label: 'Select Room...', value: '' },
                ...classrooms.map((c) => ({ label: c.name, value: c.id })),
              ]}
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 mt-2">
            2. Care, Allergies & Sleep Baseline (#7)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Allergies (comma-separated)"
              placeholder="e.g. Peanuts, Dairy, Eggs"
              value={newChild.allergies}
              onChange={(e) => setNewChild({ ...newChild, allergies: e.target.value })}
            />
            <Input
              label="Dietary Restrictions"
              placeholder="e.g. Halal, Vegetarian, Nut-Free"
              value={newChild.dietary_restrictions}
              onChange={(e) => setNewChild({ ...newChild, dietary_restrictions: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Toilet Training Status"
              value={newChild.toilet_training_status}
              onChange={(e) => setNewChild({ ...newChild, toilet_training_status: e.target.value })}
              options={[
                { label: 'In Diapers', value: 'diapers' },
                { label: 'In Training', value: 'in_training' },
                { label: 'Fully Trained', value: 'trained' },
              ]}
            />
            <Input
              label="Nap Preferences"
              placeholder="e.g. Sleeps 1-2 PM with soft music"
              value={newChild.nap_preferences}
              onChange={(e) => setNewChild({ ...newChild, nap_preferences: e.target.value })}
            />
            <Input
              label="Medical / Medication Notes"
              placeholder="e.g. Inhaler or EpiPen location"
              value={newChild.medical_notes}
              onChange={(e) => setNewChild({ ...newChild, medical_notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRegisterModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              Save Registration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
