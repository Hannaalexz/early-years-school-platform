import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.js';
import { AppLayout } from './components/layout/AppLayout.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { SchoolWebsitePage } from './pages/website/SchoolWebsitePage.js';
import { AdminDashboard } from './pages/dashboard/AdminDashboard.js';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard.js';
import { ParentDashboard } from './pages/dashboard/ParentDashboard.js';
import { AdmissionsDashboard } from './pages/dashboard/AdmissionsDashboard.js';
import { SchoolSettingsPage } from './pages/settings/SchoolSettingsPage.js';
import { UsersPage } from './pages/settings/UsersPage.js';
import { RolesPage } from './pages/settings/RolesPage.js';
import { AllChildrenPage } from './pages/children/AllChildrenPage.js';
import { ChildProfilePage } from './pages/children/ChildProfilePage.js';
import { ParentsDirectoryPage } from './pages/parents/ParentsDirectoryPage.js';
import { PortalAccessPage } from './pages/parents/PortalAccessPage.js';
import { ParentPortalView } from './pages/portal/ParentPortalView.js';
import { AttendanceRollPage } from './pages/attendance/AttendanceRollPage.js';
import { MonthlyProgressPage } from './pages/development/MonthlyProgressPage.js';
import { ObservationsPage } from './pages/development/ObservationsPage.js';
import { ActivitiesPage } from './pages/activities/ActivitiesPage.js';
import { IncidentsPage } from './pages/health/IncidentsPage.js';
import { ClassroomsPage } from './pages/classrooms/ClassroomsPage.js';
import { ModulePlaceholder } from './pages/placeholder/ModulePlaceholder.js';

export const App: React.FC = () => {
  const { user, loading } = useAuth();

  // Read initial path from hash or default to /website
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== '/') return hash;
    return '/website';
  });

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Sync currentPath with window.location.hash
  useEffect(() => {
    if (window.location.hash !== `#${currentPath}`) {
      window.location.hash = currentPath;
    }
  }, [currentPath]);

  // Listen to browser forward/backward hash events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== currentPath) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-400 text-white flex items-center justify-center text-xl animate-bounce mx-auto shadow-md shadow-primary-500/30">
            🫧
          </div>
          <p className="text-xs font-bold text-primary-800">Loading Bubbles Early Years Platform...</p>
        </div>
      </div>
    );
  }

  // 1. Public School Website
  if (currentPath === '/website' || currentPath === '/') {
    return (
      <SchoolWebsitePage
        onNavigateToPortal={() => setCurrentPath('/portal')}
        onNavigateToLogin={() => setCurrentPath('/login')}
        onNavigateToDashboard={() => setCurrentPath('/dashboard')}
        isStaffLoggedIn={!!user}
      />
    );
  }

  // 2. Dedicated Parent Portal (Mobile-first, PIN-access, no ERP account needed)
  if (currentPath === '/portal') {
    return (
      <ParentPortalView
        onBackToWebsite={() => setCurrentPath('/website')}
        onBackToApp={() => setCurrentPath('/dashboard')}
      />
    );
  }

  // 3. Staff Login Page
  if (currentPath === '/login') {
    if (user) {
      setCurrentPath('/dashboard');
      return null;
    }
    return (
      <LoginPage
        onBackToWebsite={() => setCurrentPath('/website')}
        onOpenPortal={() => setCurrentPath('/portal')}
        onLoginSuccess={() => setCurrentPath('/dashboard')}
      />
    );
  }

  // 4. If user is NOT logged in and requests an internal staff route, send to login
  if (!user) {
    return (
      <LoginPage
        onBackToWebsite={() => setCurrentPath('/website')}
        onOpenPortal={() => setCurrentPath('/portal')}
        onLoginSuccess={() => setCurrentPath('/dashboard')}
      />
    );
  }

  const handleOpenChildProfile = (childId: string) => {
    setSelectedChildId(childId);
    setCurrentPath('/children/profile');
  };

  const handleBackToRoster = () => {
    setSelectedChildId(null);
    setCurrentPath('/children/all');
  };

  // Render appropriate dashboard depending on active role
  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'teacher':
        return <TeacherDashboard onNavigate={setCurrentPath} />;
      case 'parent':
        return <ParentDashboard onNavigate={setCurrentPath} />;
      case 'admissions':
        return <AdmissionsDashboard onNavigate={setCurrentPath} />;
      case 'super_admin':
      case 'school_admin':
      default:
        return <AdminDashboard onNavigate={setCurrentPath} />;
    }
  };

  // Main routing dispatcher
  const renderContent = () => {
    if (currentPath === '/dashboard') {
      return renderDashboardByRole();
    }

    // Phase 2: Children & Parents Routes
    if (currentPath === '/children/profile' && selectedChildId) {
      return <ChildProfilePage childId={selectedChildId} onBack={handleBackToRoster} onNavigateTab={setCurrentPath} />;
    }
    if (currentPath.startsWith('/children/all') || currentPath === '/children') {
      return <AllChildrenPage onSelectChild={handleOpenChildProfile} />;
    }
    if (currentPath.startsWith('/parents/portal-access')) {
      return <PortalAccessPage onOpenPortal={() => setCurrentPath('/portal')} />;
    }
    if (currentPath.startsWith('/parents/directory') || currentPath === '/parents') {
      return <ParentsDirectoryPage onSelectChild={handleOpenChildProfile} />;
    }

    // Attendance Roll Call & Pickup (Section 37 & 38)
    if (currentPath.startsWith('/attendance') || currentPath.startsWith('/children/attendance') || currentPath.startsWith('/children/pickup') || currentPath.startsWith('/daily-care')) {
      return <AttendanceRollPage />;
    }

    // Early Years Development & Monthly Progress (Ages 1–6)
    if (currentPath.startsWith('/development/monthly-progress')) {
      return <MonthlyProgressPage onNavigate={setCurrentPath} />;
    }
    if (currentPath.startsWith('/development')) {
      return <ObservationsPage onNavigate={setCurrentPath} />;
    }

    // Play-Based Classroom Activities
    if (currentPath.startsWith('/activities')) {
      return <ActivitiesPage />;
    }

    // Health & Safety (Allergies & Incidents)
    if (currentPath.startsWith('/health')) {
      return <IncidentsPage />;
    }

    // Classrooms Management & Early Years Environments
    if (
      currentPath.startsWith('/classrooms') ||
      currentPath === '/children/classrooms' ||
      currentPath.startsWith('/settings/classrooms')
    ) {
      return <ClassroomsPage onNavigate={setCurrentPath} onSelectChild={handleOpenChildProfile} />;
    }

    // Settings routes
    if (
      currentPath.startsWith('/settings/school') ||
      currentPath.startsWith('/settings/campuses') ||
      currentPath.startsWith('/settings/programs')
    ) {
      return <SchoolSettingsPage />;
    }
    if (currentPath.startsWith('/settings/users') || currentPath.startsWith('/staff')) {
      return <UsersPage />;
    }
    if (currentPath.startsWith('/settings/roles') || currentPath.startsWith('/settings/permissions')) {
      return <RolesPage />;
    }

    // Phase 7: Communication & Gallery
    if (currentPath.startsWith('/communication') || currentPath.startsWith('/parents/messages')) {
      return (
        <ModulePlaceholder
          title="Family Communication & Photo Gallery"
          phaseNumber={7}
          phaseName="Communication & Messaging"
          description="Direct teacher-to-parent messaging, school broadcast announcements, and privacy-protected classroom media galleries."
          features={[
            'Private teacher-parent conversations with read receipts and notifications',
            'School-wide and classroom-specific announcements',
            'Privacy-aware photo gallery restricted strictly to authorized guardians',
            'Notification framework for in-app, email, and mobile push',
          ]}
          onNavigate={setCurrentPath}
        />
      );
    }

    // Phase 11: Reports
    if (currentPath.startsWith('/reports')) {
      return (
        <ModulePlaceholder
          title="Executive Reporting & Analytics"
          phaseNumber={11}
          phaseName="Reporting & Analytics"
          description="Comprehensive school analytics, attendance trends, developmental summaries, and regulatory PDF/CSV exports."
          features={[
            'Enrollment by age group, classroom fill rates, and student-teacher ratios',
            'Longitudinal attendance trends and absence hot-spot analysis',
            'Aggregated developmental progress metrics across early-years milestones',
            'PDF report card generation and audit exports',
          ]}
          onNavigate={setCurrentPath}
        />
      );
    }

    // Fallback: Default to Dashboard
    return renderDashboardByRole();
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderContent()}
    </AppLayout>
  );
};
