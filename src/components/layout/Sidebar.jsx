import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Server, 
  Box, 
  Settings, 
  FileCode,
  X,
  Hexagon
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: 'Overview', to: '/', icon: Home },
  { name: 'Cluster', to: '/cluster', icon: Server },
  { name: 'Deployments', to: '/deployments', icon: Box },
  { name: 'Configs', to: '/configurations', icon: FileCode },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useDashboardStore();

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          sidebar-root
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col
          w-[240px] lg:w-[60px]
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-14 lg:justify-center px-4 lg:px-0 flex-shrink-0">
          <div className="flex items-center gap-3 lg:gap-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="sidebar-title font-semibold text-sm lg:hidden tracking-tight">
              Cluster Companion
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="sidebar-close lg:hidden ml-auto p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 lg:px-2 px-3 overflow-y-auto">
          <TooltipProvider delayDuration={0}>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={({ isActive }) =>
                        `sidebar-nav-item flex items-center lg:justify-center gap-3 lg:gap-0
                        px-3 py-2.5 lg:p-2 rounded-md text-[13px] font-medium
                        transition-all duration-150
                        ${isActive ? 'active' : ''}`
                      }
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="lg:hidden">{item.name}</span>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="hidden lg:block">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </nav>

        {/* Footer - mobile only */}
        <div className="px-4 py-3 lg:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow flex-shrink-0" />
            <span className="sidebar-footer-text text-xs">
              Connected
            </span>
          </div>
        </div>

        {/* Desktop status dot */}
        <div className="hidden lg:flex items-center justify-center py-3 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
        </div>
      </aside>
    </>
  );
};
