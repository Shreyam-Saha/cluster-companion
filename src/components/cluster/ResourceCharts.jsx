import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-2.5 shadow-elevated">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium tabular-nums">{entry.value}{typeof entry.value === 'number' && entry.unit ? entry.unit : '%'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ResourceCharts = ({ data }) => {
  const namespaceData = [
    { name: 'production', cpu: 75, memory: 85 },
    { name: 'default', cpu: 20, memory: 35 },
    { name: 'infra', cpu: 45, memory: 55 },
    { name: 'monitoring', cpu: 30, memory: 40 },
    { name: 'kube-system', cpu: 55, memory: 65 },
  ];

  const axisProps = {
    stroke: 'hsl(var(--muted-foreground))',
    fontSize: 10,
    tickLine: false,
    axisLine: false,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CPU & Memory */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">CPU & Memory Trends</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-normal">24h</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-3">
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gcCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gcMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="timestamp" {...axisProps} interval="preserveStartEnd" />
                <YAxis {...axisProps} unit="%" width={35} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={7} />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#gcCpu)" name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gcMem)" name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network I/O */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Network I/O</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-normal">MB/s</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-3">
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gcNetIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gcNetOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="timestamp" {...axisProps} interval="preserveStartEnd" />
                <YAxis {...axisProps} unit=" MB" width={40} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={7} />
                <Area type="monotone" dataKey="networkIn" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gcNetIn)" name="In" />
                <Area type="monotone" dataKey="networkOut" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#gcNetOut)" name="Out" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Namespace Usage */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 px-4 sm:px-6">
          <CardTitle className="text-sm font-semibold">Namespace Resource Usage</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 pb-3">
          <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
            <BarChart data={namespaceData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} unit="%" width={35} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={7} />
              <Bar dataKey="cpu" fill="#3b82f6" radius={[3, 3, 0, 0]} name="CPU %" />
              <Bar dataKey="memory" fill="#10b981" radius={[3, 3, 0, 0]} name="Memory %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
