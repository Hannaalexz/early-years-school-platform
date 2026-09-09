import React, { useState } from 'react';
import {
  Baby,
  Clock,
  Utensils,
  Moon,
  Camera,
  Heart,
  Calendar,
  Coins,
  Smile,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';

interface ParentDashboardProps {
  onNavigate: (path: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onNavigate }) => {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const children = [
    {
      id: 'emma',
      name: 'Emma Johnson',
      age: '4 years 3 months',
      classroom: 'Sunshine Classroom (KG 1)',
      teacher: 'Ms. Bethany Claire',
      status: 'Present Today',
      arrival: '08:55 AM (Checked in by Ms. Bethany)',
      mood: 'Happy 😊',
      nap: '1h 15m (Rested well)',
      breakfast: 'Ate all (Warm oatmeal & sliced banana)',
      lunch: 'Ate most (Steamed veggies & chicken rice)',
      snack: 'Scheduled for 03:00 PM',
      currentActivity: 'Finger Painting — Color Mixing Exploration',
      recentPhotos: 6,
      balanceDue: '15,000 ETB',
    },
    {
      id: 'noah',
      name: 'Noah Johnson',
      age: '1 year 8 months',
      classroom: 'Butterfly Room (Toddlers)',
      teacher: 'Ms. Helen Mekonnen',
      status: 'Present Today',
      arrival: '08:55 AM (Checked in by Ms. Helen)',
      mood: 'Calm & Curious 🥰',
      nap: '1h 45m (Sleeping peacefully right now)',
      breakfast: 'Ate well (Soft banana porridge)',
      lunch: 'In progress',
      snack: 'Scheduled for 03:15 PM',
      currentActivity: 'Sensory Texture Ball Play',
      recentPhotos: 4,
      balanceDue: '0 ETB (Settled)',
    },
  ];

  const currentChild = children[selectedChildIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Warm Parent Greeting & Child Switcher (#17: Multi-child switching) */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-700 rounded-3xl p-6 text-white shadow-warm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-sage-200 uppercase tracking-wider">
              Parent & Family Portal
            </span>
            <h2 className="text-2xl font-extrabold mt-1">Good morning, Sarah 👋</h2>
            <p className="text-xs sm:text-sm text-sage-200 mt-0.5">
              {currentChild.name} is having a wonderful day at Little Stars.
            </p>
          </div>

          {/* Child Switcher Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-forest-900/50 border border-forest-600">
            {children.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedChildIndex === idx
                    ? 'bg-white text-forest-900 shadow-sm'
                    : 'text-sage-200 hover:text-white'
                }`}
              >
                {c.name.split(' ')[0]} ({idx === 0 ? 'KG1' : 'Toddler'})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Child Live Status Card (#8 Child Profile UI Concept) */}
      <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-ivory-200 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-terracotta-100 text-terracotta-600 font-extrabold text-2xl flex items-center justify-center border border-terracotta-200 shadow-xs">
              {currentChild.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-ink-900">{currentChild.name}</h3>
                <Badge variant="success" dot>{currentChild.status}</Badge>
              </div>
              <p className="text-xs text-ink-500 mt-1">
                Age: {currentChild.age} • {currentChild.classroom}
              </p>
              <p className="text-xs text-forest-700 font-medium mt-0.5">
                Teacher: {currentChild.teacher}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Camera size={14} />}
              onClick={() => onNavigate('/communication/gallery')}
            >
              Photos ({currentChild.recentPhotos})
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => onNavigate('/development/portfolios')}
            >
              View Portfolio
            </Button>
          </div>
        </div>

        {/* Live Daily Care Moments (Arrival, Meals, Nap, Mood) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200">
            <div className="flex items-center gap-2 text-forest-800 text-xs font-bold mb-1">
              <Clock size={16} />
              <span>Arrival</span>
            </div>
            <p className="text-sm font-extrabold text-ink-900 mt-1">08:55 AM</p>
            <p className="text-[11px] text-ink-500 mt-0.5">Checked in by Teacher</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
              <Smile size={16} />
              <span>Today's Mood</span>
            </div>
            <p className="text-sm font-extrabold text-ink-900 mt-1">{currentChild.mood}</p>
            <p className="text-[11px] text-ink-500 mt-0.5">Active & participating</p>
          </div>

          <div className="p-4 rounded-2xl bg-terracotta-50 border border-terracotta-200">
            <div className="flex items-center gap-2 text-terracotta-700 text-xs font-bold mb-1">
              <Utensils size={16} />
              <span>Meals</span>
            </div>
            <p className="text-xs font-bold text-ink-900 mt-1">Lunch: {currentChild.lunch}</p>
            <p className="text-[11px] text-ink-500 mt-0.5">Breakfast: {currentChild.breakfast}</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
            <div className="flex items-center gap-2 text-sky-800 text-xs font-bold mb-1">
              <Moon size={16} />
              <span>Nap Time</span>
            </div>
            <p className="text-sm font-extrabold text-ink-900 mt-1">{currentChild.nap}</p>
            <p className="text-[11px] text-ink-500 mt-0.5">Quiet room, soft lullaby</p>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards (#8: Attendance 95%, Development 82%, Daily Reports 18, Activities 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 text-center shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Attendance</span>
          <p className="text-2xl font-extrabold text-forest-800 mt-1">95%</p>
          <span className="text-[10px] text-forest-700 font-medium">19 of 20 days</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 text-center shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Development</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">82%</p>
          <span className="text-[10px] text-forest-700 font-medium">14 Milestones hit</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 text-center shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Daily Reports</span>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">18</p>
          <span className="text-[10px] text-ink-500">Published</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-ivory-300 text-center shadow-subtle">
          <span className="text-xs text-ink-500 font-semibold">Activities</span>
          <p className="text-2xl font-extrabold text-terracotta-600 mt-1">24</p>
          <span className="text-[10px] text-ink-500">Completed</span>
        </div>
      </div>

      {/* Today's Teacher Note Preview (#16) */}
      <Card
        title="Today's Classroom Highlight"
        subtitle="Shared by Ms. Bethany"
        action={
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/daily-care/reports')}>
            View All Reports
          </Button>
        }
      >
        <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 text-xs sm:text-sm text-ink-700 leading-relaxed">
          <p className="font-semibold text-ink-900 mb-1">
            🎨 Activity: {currentChild.currentActivity}
          </p>
          <p className="italic text-ink-600">
            "{currentChild.name.split(' ')[0]} was wonderfully expressive during morning circle and painting time! She blended blue and yellow to create green leaves for our nature tree project and cooperatively shared paints with her table partner Noah."
          </p>
        </div>
      </Card>
    </div>
  );
};
