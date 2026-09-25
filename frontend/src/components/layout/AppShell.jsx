import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { TopHeader } from './TopHeader.jsx';


export function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-4rem)] bg-surface-page">{children}</main>
      </div>
    </div>
  );
}