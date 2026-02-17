import { Box, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const DeploymentCard = ({ deployment, pods, onClick }) => {
  const deploymentPods = pods.filter(p => p.deployment === deployment.name);
  
  const podStatusCounts = {
    Running: deploymentPods.filter(p => p.status === 'Running').length,
    Pending: deploymentPods.filter(p => p.status === 'Pending').length,
    CrashLoopBackOff: deploymentPods.filter(p => p.status === 'CrashLoopBackOff').length,
    Failed: deploymentPods.filter(p => p.status === 'Failed').length,
  };

  const statusConfig = {
    Healthy: { badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0', dot: 'bg-emerald-500' },
    Degraded: { badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0', dot: 'bg-amber-500' },
    Failed: { badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-0', dot: 'bg-red-500' },
  };

  const config = statusConfig[deployment.status] || statusConfig.Healthy;
  const replicaPercent = (deployment.replicas.ready / deployment.replicas.desired) * 100;

  return (
    <Card
      onClick={onClick}
      className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
    >
      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 rounded-lg bg-muted flex-shrink-0">
              <Box className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {deployment.name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                {deployment.namespace}
              </p>
            </div>
          </div>
          <Badge className={`text-[10px] px-1.5 flex-shrink-0 ${config.badge}`}>
            {deployment.status}
          </Badge>
        </div>

        {/* Replicas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Replicas</span>
            <span className="font-medium tabular-nums">
              {deployment.replicas.ready}/{deployment.replicas.desired}
            </span>
          </div>
          <Progress value={replicaPercent} className="h-1.5" />
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: deployment.replicas.desired }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < deployment.replicas.ready ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pod Status */}
        <div className="flex flex-wrap gap-1.5">
          {podStatusCounts.Running > 0 && (
            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 px-1.5">
              {podStatusCounts.Running} Running
            </Badge>
          )}
          {podStatusCounts.Pending > 0 && (
            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 px-1.5">
              {podStatusCounts.Pending} Pending
            </Badge>
          )}
          {podStatusCounts.CrashLoopBackOff > 0 && (
            <Badge variant="secondary" className="text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border-0 px-1.5">
              {podStatusCounts.CrashLoopBackOff} Crashing
            </Badge>
          )}
        </div>

        {/* Resources */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground">CPU</div>
            <div className="text-sm font-medium tabular-nums">{deployment.cpu.current}m</div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground tabular-nums">
              {deployment.cpu.request}/{deployment.cpu.limit}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">Memory</div>
            <div className="text-sm font-medium tabular-nums">{deployment.memory.current}Mi</div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground tabular-nums">
              {deployment.memory.request}/{deployment.memory.limit}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2.5 sm:pt-3 border-t">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{format(deployment.lastUpdated, 'MMM dd, HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Activity className="w-3 h-3" />
            <span>Rev {deployment.revisions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
