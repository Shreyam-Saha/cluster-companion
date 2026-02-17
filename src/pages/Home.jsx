import { Server, Box, Layers, Cpu } from 'lucide-react';
import { StatusCard } from '../components/dashboard/StatusCard';
import { ResourceGauge } from '../components/dashboard/ResourceGauge';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { EventFeed } from '../components/dashboard/EventFeed';
import { useMockData } from '../hooks/useMockData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-2.5 sm:p-3 shadow-elevated">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium tabular-nums">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const Home = () => {
  const { stats, alerts, events, timeSeriesData } = useMockData();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Cluster Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring for{' '}
          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded inline-block mt-0.5 sm:mt-0">
            prod-us-east-1
          </span>
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatusCard
          title="Cluster Health"
          value={stats.clusterHealth}
          subtitle={`${stats.nodes.healthy}/${stats.nodes.total} nodes healthy`}
          status={stats.clusterHealth === 'Healthy' ? 'healthy' : 'warning'}
          icon={Server}
        />
        <StatusCard
          title="Total Nodes"
          value={stats.nodes.total}
          subtitle={stats.nodes.unhealthy > 0 ? `${stats.nodes.unhealthy} unhealthy` : 'All nodes healthy'}
          status={stats.nodes.unhealthy > 0 ? 'warning' : 'healthy'}
          icon={Server}
        />
        <StatusCard
          title="Total Pods"
          value={stats.pods.total}
          subtitle={`${stats.pods.running} running, ${stats.pods.failed} failed`}
          status={stats.pods.failed > 0 ? 'warning' : 'healthy'}
          icon={Box}
        />
        <StatusCard
          title="Namespaces"
          value={stats.namespaces}
          subtitle={`${stats.deployments} active deployments`}
          status="healthy"
          icon={Layers}
        />
      </div>

      {/* Resource Utilization */}
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Cpu className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <h2 className="text-sm sm:text-base font-semibold">Resource Utilization</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <ResourceGauge
            title="CPU Usage"
            percentage={parseInt(stats.resources.cpu.usagePercent)}
            total={stats.resources.cpu.total}
            used={stats.resources.cpu.used}
            unit="cores"
          />
          <ResourceGauge
            title="Memory Usage"
            percentage={parseInt(stats.resources.memory.usagePercent)}
            total={stats.resources.memory.total}
            used={stats.resources.memory.used}
            unit="GB"
          />
          <ResourceGauge
            title="Disk Usage"
            percentage={65}
            total={500}
            used={325}
            unit="GB"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 sm:divide-x">
            {[
              { label: 'Running Pods', value: stats.pods.running, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Pending Pods', value: stats.pods.pending, color: 'text-amber-600 dark:text-amber-400' },
              { label: 'Failed Pods', value: stats.pods.failed, color: 'text-red-600 dark:text-red-400' },
              { label: 'Services', value: stats.services, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Deployments', value: 12, color: 'text-violet-600 dark:text-violet-400' },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? 'sm:pl-4' : ''}`}>
                <div className={`text-lg sm:text-2xl font-semibold tabular-nums leading-none ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Trends Chart */}
      <Card className="shadow-card">
        <CardHeader className="px-4 sm:px-6 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base font-semibold">Resource Trends</CardTitle>
            <Badge variant="secondary" className="text-[10px] sm:text-xs font-normal">Last 24h</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pt-0 pb-3 sm:pb-4">
          <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                unit="%"
                width={40}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
                iconSize={7}
              />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradCpu)"
                name="CPU %"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradMemory)"
                name="Memory %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AlertPanel alerts={alerts} />
        <EventFeed events={events} />
      </div>
    </div>
  );
};
