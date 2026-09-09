import React, { useEffect, useState } from 'react';
import { Shield, Lock, Check, X } from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { api } from '../../services/api.js';

export const RolesPage: React.FC = () => {
  const [data, setData] = useState<{
    roles: any[];
    permissions: any[];
    role_permissions: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRolesAndPermissions().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-ink-500">Loading Roles & Permissions Matrix...</div>;
  }

  const { roles, permissions, role_permissions } = data;

  const hasPerm = (roleId: string, permId: string) => {
    if (roleId === 'super_admin') return true;
    return role_permissions.some((rp) => rp.role_id === roleId && rp.permission_id === permId);
  };

  // Group permissions by category
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-ink-900">Roles & Permissions Matrix</h2>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Role-Based Access Control (RBAC) security enforcement across all early-years modules.
        </p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {roles.map((r) => (
          <div key={r.id} className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
            <span className="text-[11px] font-bold text-ink-900 block truncate">{r.display_name}</span>
            <span className="text-[10px] text-ink-500 block mt-0.5">{r.user_count} Active Users</span>
            <Badge variant="success" size="sm" className="mt-2">
              {r.id === 'super_admin' ? 'All' : r.permissions_count} Perms
            </Badge>
          </div>
        ))}
      </div>

      {/* Matrix Table */}
      <Card title="Permissions Enforcement Matrix" subtitle="Fine-grained system authorization matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ivory-200 text-ink-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3 w-1/3">Permission</th>
                {roles.map((r) => (
                  <th key={r.id} className="pb-3 text-center px-2">
                    {r.display_name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {categories.map((cat) => {
                const permsInCat = permissions.filter((p) => p.category === cat);
                return (
                  <React.Fragment key={cat}>
                    <tr className="bg-ivory-50/80">
                      <td colSpan={roles.length + 1} className="py-2 px-3 font-bold text-forest-800 uppercase tracking-wider text-[10px]">
                        Category: {cat}
                      </td>
                    </tr>
                    {permsInCat.map((p) => (
                      <tr key={p.id} className="hover:bg-ivory-50/50">
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-ink-900">{p.name}</p>
                          <p className="text-[10px] text-ink-500">{p.description}</p>
                        </td>
                        {roles.map((r) => {
                          const permitted = hasPerm(r.id, p.id);
                          return (
                            <td key={r.id} className="py-2.5 text-center">
                              {permitted ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sage-100 text-forest-800">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-ink-300">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
