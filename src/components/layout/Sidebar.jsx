import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Server, 
  Box, 
  Settings, 
  FileCode,
  Menu,
  X
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Cluster', to: '/cluster', icon: Server },
  { name: 'Deployments', to: '/deployments', icon: Box },
  { name: 'Configurations', to: '/configurations', icon: FileCode },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useDashboardStore();

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col
          w-64 lg:w-14
          transition-all duration-300 ease-in-out
          border-r border-border bg-card
          ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-14 border-b border-border lg:px-0 px-4">
          <div className="flex items-center space-x-3 lg:space-x-0">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center lg:mx-auto">
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg lg:hidden whitespace-nowrap">
              K8s Monitor
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 lg:px-0 px-2">
          <TooltipProvider delayDuration={0}>
            {navigation.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `
                      flex items-center justify-center lg:justify-center space-x-3 lg:space-x-0 
                      px-3 py-2.5 lg:py-2.5 lg:mx-1.5 rounded-md
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="lg:hidden whitespace-nowrap">
                      {item.name}
                    </span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:block hidden">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        <Separator />

        {/* Footer */}
        <div className="p-4 lg:hidden">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Kubernetes v1.28.5</p>
            <p>3 nodes • 30 pods</p>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        onClick={toggleSidebar}
        size="icon"
        className="fixed bottom-4 right-4 z-40 lg:hidden h-12 w-12 rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
};
