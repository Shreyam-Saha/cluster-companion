import { Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EventFeed = ({ events }) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="px-4 sm:px-5 py-3 sm:py-4 flex-row items-center space-y-0 gap-2 border-b">
        <Activity className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      
      <ScrollArea className="h-[300px] sm:h-[340px]">
        <div className="divide-y">
          {events.slice(0, 12).map((event) => (
            <div key={event.id} className="px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  event.type === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start sm:items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium leading-tight">
                      {event.reason}
                    </h3>
                    <Badge 
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 h-5 flex-shrink-0 border-0 ${
                        event.type === 'Warning' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {event.message}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 flex-wrap">
                    <span className="font-mono truncate max-w-[180px] sm:max-w-none">{event.namespace}/{event.object}</span>
                    <span>&middot;</span>
                    <span className="whitespace-nowrap flex-shrink-0">{format(event.timestamp, 'HH:mm:ss')}</span>
                    {event.count > 1 && (
                      <>
                        <span>&middot;</span>
                        <span className="font-medium">{event.count}x</span>
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
