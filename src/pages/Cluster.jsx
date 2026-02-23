import { useState } from 'react';
import { Filter, Server } from 'lucide-react';
import { NodeTable } from '../components/cluster/NodeTable';
import { NodeDetailPanel } from '../components/cluster/NodeDetailPanel';
import { ResourceCharts } from '../components/cluster/ResourceCharts';
import { TimeRangeSelector } from '../components/dashboard/TimeRangeSelector';
import { useMockData } from '../hooks/useMockData';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Cluster = () => {
  const { nodes, timeSeriesData, events, namespaceUsage } = useMockData();
  const timeRange = useDashboardStore((s) => s.timeRange);
  const [selectedNode, setSelectedNode] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');

  const filteredEvents = eventFilter === 'all' 
    ? events 
    : events.filter(e => e.type === eventFilter);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Cluster</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Node health, resource trends, and events
          </p>
        </div>
        <TimeRangeSelector />
      </div>

      {/* Nodes */}
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Server className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <h2 className="text-sm sm:text-base font-semibold">Nodes</h2>
          <Badge variant="secondary" className="text-[10px]">{nodes.length}</Badge>
        </div>
        <NodeTable
          nodes={nodes}
          onNodeSelect={setSelectedNode}
          selectedNode={selectedNode}
        />
      </div>

      {/* Charts */}
      <ResourceCharts data={timeSeriesData} timeRange={timeRange} namespaceUsage={namespaceUsage} />

      {/* Events */}
      <Card className="shadow-card">
        <CardHeader className="border-b py-3 sm:py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <CardTitle className="text-sm font-semibold whitespace-nowrap">Events Log</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{filteredEvents.length}</Badge>
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[130px] sm:w-[140px] h-8 text-xs border-0 bg-secondary/50 flex-shrink-0">
                <Filter className="w-3 h-3 mr-1 flex-shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <ScrollArea className="h-80 sm:h-96">
          <div className="divide-y">
            {filteredEvents.slice(0, 20).map((event) => (
              <div key={event.id} className="px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    event.type === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start sm:items-baseline justify-between gap-2">
                      <h3 className="font-medium text-sm leading-tight">{event.reason}</h3>
                      <Badge 
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 h-5 border-0 flex-shrink-0 ${
                          event.type === 'Warning' 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.message}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 flex-wrap">
                      <span className="font-mono truncate max-w-[200px]">{event.namespace}/{event.object}</span>
                      <span>&middot;</span>
                      <span className="whitespace-nowrap">{new Date(event.timestamp).toLocaleString()}</span>
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

      {/* Node Detail */}
      {selectedNode && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setSelectedNode(null)} />
          <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        </>
      )}
    </div>
  );
};
