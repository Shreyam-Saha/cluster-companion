import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useDashboardStore } from '../../store/dashboardStore';

export const Layout = () => {
  const { theme } = useDashboardStore();

  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        
        <main className="flex-1 overflow-auto scroll-smooth">
          <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
