import React from 'react';
import { Sparkles, ArrowLeft, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';

interface ModulePlaceholderProps {
  title: string;
  phaseNumber: number;
  phaseName: string;
  description: string;
  features: string[];
  onNavigate: (path: string) => void;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  title,
  phaseNumber,
  phaseName,
  description,
  features,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:underline"
      >
        <ArrowLeft size={14} />
        <span>Return to Dashboard</span>
      </button>

      {/* Main Roadmap Preview Card */}
      <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-warm text-center">
        <div className="w-16 h-16 rounded-2xl bg-sage-100 text-forest-800 flex items-center justify-center text-2xl mx-auto mb-4 border border-sage-200 shadow-xs">
          🌱
        </div>

        <Badge variant="terracotta" size="md" className="mb-3">
          Roadmap: Phase {phaseNumber} — {phaseName}
        </Badge>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-ink-600 max-w-xl mx-auto mt-2 leading-relaxed">
          {description}
        </p>

        {/* Planned Features in this Module */}
        <div className="mt-8 text-left max-w-xl mx-auto p-5 rounded-2xl bg-ivory-50 border border-ivory-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-terracotta-500" />
            <span>Architecture & Specifications Ready:</span>
          </h4>
          <ul className="space-y-2.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-ink-700">
                <CheckCircle2 size={15} className="text-forest-600 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('/dashboard')}
          >
            Go to Active Dashboard
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('/settings/users')}
          >
            Review RBAC Users
          </Button>
        </div>
      </div>
    </div>
  );
};
