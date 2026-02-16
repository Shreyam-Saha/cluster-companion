import { Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EventFeed = ({ events }) => {
  return (
    <Card>
      <CardHeader className="px-4 py-3 flex-row items-center space-y-0 space-x-2 border-b">
        <Activity className="w-4 h-4" />
        <h2 className="text-sm font-semibold">
          Recent Activity
        </h2>
      </CardHeader>
      
      <ScrollArea className="h-80">
        <div className="divide-y">
          {events.slice(0, 10).map((event) => (
            <div key={event.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start space-x-2.5">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  event.type === 'Warning' ? 'bg-status-warning' : 'bg-status-healthy'
                }`} />
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-medium text-xs">
                      {event.reason}
                    </h3>
                    <Badge 
                      variant={event.type === 'Warning' ? 'destructive' : 'default'}
                      className={`text-xs ${
                        event.type === 'Warning' 
                          ? 'bg-status-warning/10 text-status-warning hover:bg-status-warning/20'
                          : 'bg-status-healthy/10 text-status-healthy hover:bg-status-healthy/20'
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {event.message}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="truncate">{event.namespace}/{event.object}</span>
                    <span>•</span>
                    <span className="flex-shrink-0">{format(event.timestamp, 'HH:mm:ss')}</span>
                    {event.count > 1 && (
                      <>
                        <span>•</span>
                        <span>{event.count}x</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
