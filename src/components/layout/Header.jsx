import { useState } from 'react';
import { Sun, Moon, Bell, Search, ChevronDown } from 'lucide-react';
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

const clusters = [
  { id: 'production-us-east-1', name: 'Production (US East)' },
  { id: 'staging-us-west-2', name: 'Staging (US West)' },
  { id: 'development-eu-central-1', name: 'Development (EU Central)' },
];

export const Header = () => {
  const { theme, toggleTheme, selectedCluster, setSelectedCluster } = useDashboardStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const selectedClusterData = clusters.find(c => c.id === selectedCluster);
  const alertCount = 3;

  return (
    <header className="h-14 border-b bg-background">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left section - Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pods, deployments, nodes..."
              className="pl-10 h-9 bg-background border-border"
            />
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Cluster selector */}
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-[200px] h-9 hidden md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clusters.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id}>
                  {cluster.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Theme toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notifications */}
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="w-4 h-4" />
                    {alertCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-destructive">
                        {alertCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <Card className="absolute right-0 mt-2 w-80 z-50">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <ScrollArea className="max-h-96">
                    <div className="divide-y">
                      <div className="p-3 hover:bg-muted/50">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">High Memory Usage</p>
                            <p className="text-xs text-muted-foreground">
                              worker-node-3 is at 92% memory usage
                            </p>
                            <p className="text-xs text-muted-foreground">
                              5 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-muted/50">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-status-warning flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Pod CrashLoopBackOff</p>
                            <p className="text-xs text-muted-foreground">
                              auth-service pod is restarting repeatedly
                            </p>
                            <p className="text-xs text-muted-foreground">
                              15 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="p-3 text-center border-t">
                    <Button variant="link" size="sm" className="text-xs">
                      View all notifications
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
