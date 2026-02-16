import { Server, Box, Layers, AlertCircle, Activity, TrendingUp } from 'lucide-react';
import { StatusCard } from '../components/dashboard/StatusCard';
import { ResourceGauge } from '../components/dashboard/ResourceGauge';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { EventFeed } from '../components/dashboard/EventFeed';
import { useMockData } from '../hooks/useMockData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Home = () => {
  const { stats, alerts, events, timeSeriesData } = useMockData();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            {payload.map((entry, index) => (
              <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}: {entry.value}%
              </p>
            ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold">
          Cluster Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time health and analytics for prod-us-east-1
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
          subtitle={stats.nodes.unhealthy > 0 ? `${stats.nodes.unhealthy} unhealthy` : 'All healthy'}
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
          subtitle={`${stats.deployments} deployments`}
          status="healthy"
          icon={Layers}
        />
      </div>

      {/* Resource Utilization */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Resource Utilization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

      {/* Quick Stats Row */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-status-healthy">
                {stats.pods.running}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Running Pods
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-status-warning">
                {stats.pods.pending}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Pending Pods
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-status-critical">
                {stats.pods.failed}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Failed Pods
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                {stats.services}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Services
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                12
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Deployments
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cluster Resource Trends */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Cluster Resource Trends (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217.2 91.2% 59.8%)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(217.2 91.2% 59.8%)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(158 64% 52%)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(158 64% 52%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '11px' }}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '11px' }}
                unit="%"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="hsl(217.2 91.2% 59.8%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCpu)"
                name="CPU %"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="hsl(158 64% 52%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMemory)"
                name="Memory %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EventFeed events={events} />
        <AlertPanel alerts={alerts} />
      </div>
    </div>
  );
};
