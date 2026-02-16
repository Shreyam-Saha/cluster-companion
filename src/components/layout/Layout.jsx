import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useDashboardStore } from '../../store/dashboardStore';

export const Layout = () => {
  const { theme } = useDashboardStore();

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
