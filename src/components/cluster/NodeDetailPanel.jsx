import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMockData } from '../../hooks/useMockData';
import { useDashboardStore } from '../../store/dashboardStore';
import { TIME_RANGE_LABELS } from '../dashboard/TimeRangeSelector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-2.5 shadow-elevated text-sm">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="font-medium tabular-nums">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const NodeDetailPanel = ({ node, onClose }) => {
  const { timeSeriesData } = useMockData();
  const timeRange = useDashboardStore((s) => s.timeRange);
  const rangeLabel = TIME_RANGE_LABELS[timeRange] || 'Last 24h';

  if (!node) return null;

  const charts = [
    { key: 'cpu', label: 'CPU Usage', color: '#3b82f6' },
    { key: 'memory', label: 'Memory Usage', color: '#8b5cf6' },
    { key: 'disk', label: 'Disk Usage', color: '#10b981' },
  ];

  return (
    <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[480px] md:w-[560px] z-50 shadow-elevated">
      <div className="h-full flex flex-col bg-card sm:border-l">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold truncate">{node.name}</h2>
            <p className="text-sm text-muted-foreground font-mono truncate">{node.ip}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 flex-shrink-0 ml-2">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
            {/* Node Info */}
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="text-sm">Node Information</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs mb-0.5">Status</dt>
                    <dd className={`font-medium ${
                      node.status === 'Ready' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {node.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs mb-0.5">OS</dt>
                    <dd className="truncate">{node.os}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs mb-0.5">Kernel</dt>
                    <dd className="font-mono text-xs truncate">{node.kernel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs mb-0.5">Runtime</dt>
                    <dd className="font-mono text-xs truncate">{node.containerRuntime}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs mb-0.5">Kubelet</dt>
                    <dd className="font-mono text-xs truncate">{node.kubeletVersion}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs mb-0.5">Pods</dt>
                    <dd>
                      <span className="font-medium tabular-nums">{node.pods.current}</span>
                      <span className="text-muted-foreground">/{node.pods.capacity}</span>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Charts */}
            {charts.map(({ key, label, color }) => (
              <Card key={key}>
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{label}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] font-normal">{rangeLabel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-4 pb-3">
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <XAxis
                        dataKey="timestamp"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        unit="%"
                        width={35}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        name={label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
