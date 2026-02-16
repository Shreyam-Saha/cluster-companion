import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AlertPanel = ({ alerts }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-status-critical',
          bg: 'bg-status-critical bg-opacity-10',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-status-warning',
          bg: 'bg-status-warning bg-opacity-10',
        };
      default:
        return {
          icon: Info,
          color: 'text-status-info',
          bg: 'bg-status-info bg-opacity-10',
        };
    }
  };

  return (
    <Card>
      <CardHeader className="px-4 py-3 flex-row items-center space-y-0 space-x-2 border-b">
        <AlertCircle className="w-4 h-4" />
        <h2 className="text-sm font-semibold">
          Active Alerts ({alerts.filter(a => !a.acknowledged).length})
        </h2>
      </CardHeader>
      
      <ScrollArea className="h-80">
        <div className="divide-y">
          {alerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            const Icon = config.icon;
            
            return (
              <div
                key={alert.id}
                className={`px-4 py-3 ${alert.acknowledged ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start space-x-2.5">
                  <div className={`p-1.5 rounded ${config.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium">
                        {alert.title}
                      </h3>
                      {alert.acknowledged && (
                        <Badge variant="secondary" className="text-xs">
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {alert.message}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
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
