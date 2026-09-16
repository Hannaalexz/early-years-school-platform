import React, { useEffect, useState } from 'react';
import {
  Key,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  Baby,
  Info
} from 'lucide-react';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Pagination } from '../../components/common/Pagination.js';
import { api } from '../../services/api.js';

interface PortalAccessPageProps {
  onOpenPortal: () => void;
}

export const PortalAccessPage: React.FC<PortalAccessPageProps> = ({ onOpenPortal }) => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

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

  const copyCredentials = (parent: any) => {
    const text = `Little Stars Parent Portal Access:\nParent: ${parent.first_name} ${parent.last_name}\nPortal Code: ${parent.portal_code || 'PAR-7821'}\nPIN: ${parent.portal_pin || '1234'}\nURL: ${window.location.origin}/#/portal`;
    navigator.clipboard.writeText(text);
    setCopiedId(parent.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-ink-900">Parent Portal Access Management</h2>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              PIN-Based Lightweight Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Manage lightweight portal codes and 4-digit security PINs for family daily check-ins.
          </p>
        </div>

        <button
          onClick={onOpenPortal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-sm transition"
        >
          <span>Launch Parent Portal Preview</span>
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Architecture Notice Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Lightweight Parent Architecture:</strong> Parents are registered in the family directory and access their dedicated mobile feed using their unique <strong>Portal Access Code</strong> (or phone) and a <strong>4-digit PIN</strong>. Parents are not granted full ERP user accounts, preventing system bloat and ensuring strict family privacy isolation.
        </div>
      </div>

      {/* Parents Portal Code Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-ivory-200 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Filter by parent name, phone, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
          <span className="text-xs text-ink-500 font-medium">{parents.length} Family Records</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-ink-500 text-xs">
            <RefreshCw size={20} className="animate-spin mx-auto text-forest-700 mb-2" />
            Loading portal access list...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-100/70 text-ink-600 uppercase text-[10px] tracking-wider font-bold border-b border-ivory-200">
                  <tr>
                    <th className="px-5 py-3">Parent Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Portal Access Code</th>
                    <th className="px-4 py-3">Security PIN</th>
                    <th className="px-4 py-3">Linked Children</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {parents
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((p) => {
                    const code = p.portal_code || `PAR-${p.id.substring(0, 4).toUpperCase()}`;
                    const pin = p.portal_pin || '1234';
                    const isCopied = copiedId === p.id;

                    return (
                      <tr key={p.id} className="hover:bg-ivory-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-ink-900">{p.first_name} {p.last_name}</p>
                              <p className="text-[10px] text-ink-500">{p.occupation || 'Parent'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="text-ink-800 font-medium">{p.phone}</p>
                          <p className="text-[10px] text-ink-400">{p.email || 'No email'}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-ivory-100 border border-ivory-300 font-mono font-bold text-ink-900 text-[11px] tracking-wider">
                            {code}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-forest-50 border border-forest-200 font-mono font-bold text-forest-800 text-xs">
                            {pin}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {p.children && p.children.length > 0 ? (
                              p.children.map((c: any) => (
                                <span
                                  key={c.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800"
                                >
                                  {c.first_name}
                                </span>
                              ))
                            ) : (
                              <span className="text-ink-400 italic text-[10px]">None linked</span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => copyCredentials(p)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              isCopied
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
                            }`}
                          >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                            <span>{isCopied ? 'Copied' : 'Copy Card'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-2.5 border-t border-ivory-200 bg-ivory-50/50">
              <Pagination
                currentPage={currentPage}
                totalItems={parents.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[8, 16, 24]}
                itemLabel="access cards"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
