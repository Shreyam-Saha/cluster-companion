import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AlertPanel = ({ alerts }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          dot: 'bg-red-500',
          badge: 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-0',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          dot: 'bg-amber-500',
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-0',
        };
      default:
        return {
          icon: Info,
          dot: 'bg-blue-500',
          badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-0',
        };
    }
  };

  const activeCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Card className="shadow-card">
      <CardHeader className="px-4 sm:px-5 py-3 sm:py-4 flex-row items-center justify-between space-y-0 border-b">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <CardTitle className="text-sm font-semibold">Active Alerts</CardTitle>
        </div>
        {activeCount > 0 && (
          <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
            {activeCount}
          </Badge>
        )}
      </CardHeader>
      
      <ScrollArea className="h-[300px] sm:h-[340px]">
        <div className="divide-y">
          {alerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            
            return (
              <div
                key={alert.id}
                className={`px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-muted/50 transition-colors ${
                  alert.acknowledged ? 'opacity-40' : ''
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium leading-tight">
                        {alert.title}
                      </h3>
                      <Badge className={`text-[10px] px-1.5 py-0 h-5 flex-shrink-0 ${config.badge}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      {format(alert.timestamp, 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
