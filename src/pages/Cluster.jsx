import { useState } from 'react';
import { Filter, Server } from 'lucide-react';
import { NodeTable } from '../components/cluster/NodeTable';
import { NodeDetailPanel } from '../components/cluster/NodeDetailPanel';
import { ResourceCharts } from '../components/cluster/ResourceCharts';
import { useMockData } from '../hooks/useMockData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  const { nodes, timeSeriesData, events } = useMockData();
  const [selectedNode, setSelectedNode] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');

  const filteredEvents = eventFilter === 'all' 
    ? events 
    : events.filter(e => e.type === eventFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Cluster
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Node health, resource trends, and events
        </p>
      </div>

      {/* Nodes Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2" />
          Nodes
        </h2>
        <NodeTable
          nodes={nodes}
          onNodeSelect={setSelectedNode}
          selectedNode={selectedNode}
        />
      </div>

      {/* Resource Charts */}
      <ResourceCharts data={timeSeriesData} />

      {/* Events Log */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Events Log</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="h-96">
          <div className="divide-y">
            {filteredEvents.slice(0, 20).map((event) => (
              <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    event.type === 'Warning' ? 'bg-status-warning' : 'bg-status-healthy'
                  }`} />
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-medium text-sm">
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
                    
                    <p className="text-sm text-muted-foreground">
                      {event.message}
                    </p>
                    
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className="truncate">{event.namespace}/{event.object}</span>
                      <span>•</span>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
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

      {/* Node Detail Panel */}
      {selectedNode && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          />
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </>
      )}
    </div>
  );
};
