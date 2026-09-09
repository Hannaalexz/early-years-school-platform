import React from 'react';
import { Building2, Calendar, Users, CheckCircle, Plus, Clock } from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { StatCard } from '../../components/common/StatCard.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';

interface AdmissionsDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdmissionsDashboard: React.FC<AdmissionsDashboardProps> = ({ onNavigate }) => {
  const pipeline = [
    { stage: '1. New Enquiries', count: 14, color: 'bg-ivory-200 text-ink-800' },
    { stage: '2. Campus Tours Booked', count: 5, color: 'bg-amber-100 text-amber-900' },
    { stage: '3. Applications Review', count: 6, color: 'bg-primary-100 text-primary-900 border border-primary-200' },
    { stage: '4. Accepted & Finalizing', count: 3, color: 'bg-gradient-to-r from-primary-700 to-primary-500 text-white font-bold' },
  ];

  const upcomingVisits = [
    { parent: 'Hanna Solomon', child: 'Liam (3 yrs)', program: 'Nursery', time: 'Tomorrow, 10:00 AM' },
    { parent: 'Michael Girma', child: 'Maya (4 yrs)', program: 'Preschool (KG1)', time: 'Thursday, 02:30 PM' },
    { parent: 'Dr. Almaz Kebede', child: 'Lucas (14 mos)', program: 'Toddlers', time: 'Friday, 09:30 AM' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-terracotta-600 uppercase tracking-wider">
            Admissions & Reception
          </span>
          <h2 className="text-2xl font-extrabold text-ink-900 mt-1">Enrollment Pipeline & Tours</h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Managing prospective families from website enquiry to classroom check-in
          </p>
        </div>

        <Button
          variant="terracotta"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => onNavigate('/admissions/enquiries')}
        >
          Log New Enquiry
        </Button>
      </div>

      {/* Admissions Pipeline Cards (#25) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pipeline.map((p) => (
          <div key={p.stage} className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-subtle">
            <span className="text-xs font-semibold text-ink-500">{p.stage}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-extrabold text-ink-900">{p.count}</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${p.color}`}>
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Campus Visits & Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Scheduled Campus Visits & Tours"
          subtitle="Prospective parents visiting Little Stars"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/admissions/visits')}>
              Calendar View
            </Button>
          }
        >
          <div className="space-y-3">
            {upcomingVisits.map((v) => (
              <div key={v.parent} className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-ink-900">{v.parent}</p>
                  <p className="text-[11px] text-ink-500 mt-0.5">
                    Child: {v.child} • Program: {v.program}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="warning" size="sm">
                    <Clock size={11} className="mr-1 inline" />
                    {v.time}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Website Form Integration Notice (#36) */}
        <Card
          title="Public Website Form Sync (#36)"
          subtitle="Direct link to public website admissions form"
        >
          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs text-forest-900 leading-relaxed space-y-2">
            <p className="font-bold">Automated Web Lead Ingestion:</p>
            <p>
              When prospective parents submit the public admission form on the school website, enquiries are instantly parsed, validated, and created in the PostgreSQL database ready for admissions officer follow-up.
            </p>
            <div className="pt-2">
              <Badge variant="success">✓ API Endpoint /api/admissions ready</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
