import { useState } from 'react';
import { Sun, Moon, Bell, Search, CircleDot, Menu } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const clusters = [
  { id: 'production-us-east-1', name: 'prod-us-east-1' },
  { id: 'staging-us-west-2', name: 'stg-us-west-2' },
  { id: 'development-eu-central-1', name: 'dev-eu-central-1' },
];

export const Header = () => {
  const { theme, toggleTheme, selectedCluster, setSelectedCluster, toggleSidebar } = useDashboardStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const alertCount = 3;

  return (
    <header className="h-14 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden flex-shrink-0"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Search - hidden on very small screens, shown on sm+ */}
        <div className={`flex-1 max-w-md ${showSearch ? 'block' : 'hidden sm:block'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-10 h-9 bg-secondary/50 border-0 focus-visible:ring-1 text-sm w-full"
              onBlur={() => setShowSearch(false)}
            />
          </div>
        </div>

        {/* Mobile search trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:hidden flex-shrink-0"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Spacer for mobile when search hidden */}
        {!showSearch && <div className="flex-1 sm:hidden" />}

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Cluster selector */}
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-auto sm:w-[170px] h-9 hidden md:flex border-0 bg-secondary/50 text-sm gap-2">
              <div className="flex items-center gap-2 truncate">
                <CircleDot className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {clusters.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id}>
                  {cluster.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-5 mx-0.5 hidden md:block" />

          <TooltipProvider delayDuration={300}>
            {/* Theme toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Toggle theme</p></TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4" />
                  {alertCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive ring-2 ring-card" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Notifications</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notification dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <Card className="fixed sm:absolute right-2 sm:right-4 top-14 sm:top-12 w-[calc(100vw-1rem)] sm:w-80 z-50 shadow-elevated">
                <div className="p-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <Badge variant="secondary" className="text-xs">{alertCount} new</Badge>
                </div>
                <ScrollArea className="max-h-72 sm:max-h-80">
                  <div className="divide-y">
                    {[
                      { color: 'bg-destructive', title: 'High Memory Usage', desc: 'worker-node-3 at 92% memory', time: '5m ago' },
                      { color: 'bg-amber-500', title: 'Pod CrashLoopBackOff', desc: 'auth-service restarting', time: '15m ago' },
                      { color: 'bg-blue-500', title: 'Deployment Scaled', desc: 'api-gateway scaled to 5 replicas', time: '1h ago' },
                    ].map((n, i) => (
                      <div key={i} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full ${n.color} flex-shrink-0`} />
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-sm font-medium leading-tight">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                            <p className="text-[11px] text-muted-foreground/70">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" size="sm" className="text-xs w-full text-muted-foreground">
                    View all notifications
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
