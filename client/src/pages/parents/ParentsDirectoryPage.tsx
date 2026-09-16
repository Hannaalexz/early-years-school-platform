import React, { useEffect, useState } from 'react';
import {
  Heart,
  Search,
  Phone,
  Mail,
  MapPin,
  Baby,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Pagination } from '../../components/common/Pagination.js';
import { api } from '../../services/api.js';

interface ParentsDirectoryPageProps {
  onSelectChild: (childId: string) => void;
}

export const ParentsDirectoryPage: React.FC<ParentsDirectoryPageProps> = ({ onSelectChild }) => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const loadParents = async () => {
    setLoading(true);
    const res = await api.getParents({ search: search || undefined });
    setLoading(false);
    if (res.success && res.data) {
      setParents(res.data);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadParents();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink-900">Parents & Guardians Directory</h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Registered family contacts and their linked early-years children.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-subtle flex items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search parent name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>
      </div>

      {/* Parents Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parents.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-5 border border-ivory-300 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sage-100 text-forest-800 font-extrabold text-base flex items-center justify-center border border-sage-200">
                      {p.first_name[0]}{p.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-ink-900">
                        {p.first_name} {p.last_name}
                      </h3>
                      <p className="text-[11px] text-forest-700 font-medium">{p.occupation || 'Guardian'}</p>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">Active</Badge>
                </div>

                {/* Contact info */}
                <div className="mt-4 space-y-1.5 text-xs text-ink-600">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-forest-700" />
                    <span>{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-forest-700" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-forest-700" />
                    <span className="truncate">{p.address || 'Addis Ababa'}</span>
                  </div>
                </div>

                {/* Linked Children Chips (#7) */}
                <div className="mt-4 pt-3 border-t border-ivory-200">
                  <span className="text-[10px] uppercase font-bold text-ink-500 block mb-2">
                    Enrolled Children:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.children && p.children.length > 0 ? (
                      p.children.map((c: any) => (
                        <button
                          key={c.child_id}
                          onClick={() => onSelectChild(c.child_id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-ivory-100 hover:bg-sage-100 text-ink-800 hover:text-forest-900 border border-ivory-300 text-xs font-semibold transition-colors"
                        >
                          <Baby size={12} className="text-forest-700" />
                          <span>{c.child_name}</span>
                          <span className="text-[10px] text-ink-400">({c.classroom_name || c.relationship})</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-ink-400 italic">No active enrollments</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={parents.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[6, 12, 18]}
          itemLabel="parents"
        />
      </div>
    </div>
  );
};
