import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Search, Shield, Filter, CheckCircle2, Ban, Trash2 } from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Input, Select } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';
import { Modal } from '../../components/common/Modal.js';
import { Pagination } from '../../components/common/Pagination.js';
import { api } from '../../services/api.js';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 'teacher',
    phone: '',
    title: '',
  });

  const loadUsers = async () => {
    setLoading(true);
    const res = await api.getUsers({
      role: roleFilter || undefined,
      search: search || undefined,
    });
    setLoading(false);
    if (res.success && res.data) {
      setUsers(res.data);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await api.createUser(newUser);
    setSubmitting(false);

    if (res.success) {
      setShowAddModal(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: 'teacher',
        phone: '',
        title: '',
      });
      loadUsers();
    } else {
      setError(res.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (user: any) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const res = await api.updateUserStatus(user.id, nextStatus as any);
    if (res.success) {
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink-900">User & Staff Management</h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Manage school staff, teachers, administrators, and parent access credentials.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus size={15} />}
          onClick={() => setShowAddModal(true)}
        >
          Add New User
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-ink-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Roles</option>
            <option value="school_admin">School Admin</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="finance">Finance</option>
            <option value="admissions">Admissions</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ivory-200 text-ink-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-ivory-200">
              {users
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((u) => (
                <tr key={u.id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-700 to-primary-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {u.first_name?.[0]}{u.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-ink-900">{u.first_name} {u.last_name}</p>
                        <p className="text-[11px] text-ink-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant={u.role_id === 'parent' ? 'terracotta' : u.role_id === 'teacher' ? 'success' : 'neutral'} size="sm">
                      {u.role_name || u.role_id}
                    </Badge>
                  </td>
                  <td className="py-3 text-ink-600">{u.title || '—'}</td>
                  <td className="py-3 text-ink-600">{u.phone || '—'}</td>
                  <td className="py-3">
                    <Badge
                      variant={u.status === 'active' ? 'success' : 'danger'}
                      size="sm"
                      dot
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        u.status === 'active'
                          ? 'text-dustyrose-600 hover:bg-dustyrose-50'
                          : 'text-primary-800 hover:bg-primary-50'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[8, 16, 24]}
          itemLabel="users"
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User Account"
        subtitle="Register a new staff member or parent login"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-dustyrose-50 border border-dustyrose-200 text-dustyrose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <Input
              label="Temporary Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="System Role"
              value={newUser.role_id}
              onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
              options={[
                { label: 'Early Childhood Teacher', value: 'teacher' },
                { label: 'Parent / Guardian', value: 'parent' },
                { label: 'School Administrator', value: 'school_admin' },
                { label: 'Finance Officer', value: 'finance' },
                { label: 'Admissions Officer', value: 'admissions' },
              ]}
            />
            <Input
              label="Professional Title / Notes"
              placeholder="e.g. Lead Toddler Educator"
              value={newUser.title}
              onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
            />
          </div>

          <Input
            label="Phone Number"
            placeholder="+251 91 123 4567"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-ivory-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
