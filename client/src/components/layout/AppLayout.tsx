import React, { useState } from 'react';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';
import { Breadcrumbs } from './Breadcrumbs.js';
import { MobileNav } from './MobileNav.js';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-6">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          onNavigate={onNavigate}
        />

        <Breadcrumbs currentPath={currentPath} onNavigate={onNavigate} />

        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-8">{children}</main>
      </div>

      {/* Mobile-first bottom bar */}
      <MobileNav currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
