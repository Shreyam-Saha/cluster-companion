import { Box, TrendingUp, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export const DeploymentCard = ({ deployment, pods, onClick }) => {
  const deploymentPods = pods.filter(p => p.deployment === deployment.name);
  
  const podStatusCounts = {
    Running: deploymentPods.filter(p => p.status === 'Running').length,
    Pending: deploymentPods.filter(p => p.status === 'Pending').length,
    CrashLoopBackOff: deploymentPods.filter(p => p.status === 'CrashLoopBackOff').length,
    Failed: deploymentPods.filter(p => p.status === 'Failed').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy':
        return 'text-status-healthy';
      case 'Degraded':
        return 'text-status-warning';
      case 'Failed':
        return 'text-status-critical';
      default:
        return 'text-status-unknown';
    }
  };

  // Generate sparkline data for CPU usage
  const sparklineData = Array.from({ length: 20 }, (_, i) => ({
    value: Math.random() * 100 + parseInt(deployment.cpu.current) - 50,
  }));

  return (
    <div
      onClick={onClick}
      className="card p-6 cursor-pointer hover:ring-2 hover:ring-accent-primary transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg dark:bg-surface-dark-hover light:bg-surface-light-hover">
            <Box className="w-5 h-5 dark:text-text-dark light:text-text-light" />
          </div>
          <div>
            <h3 className="font-semibold dark:text-text-dark light:text-text-light">
              {deployment.name}
            </h3>
            <p className="text-xs dark:text-text-dark-secondary light:text-text-light-secondary mt-1">
              {deployment.namespace}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(deployment.status)} bg-opacity-10`}>
          {deployment.status}
        </span>
      </div>

      {/* Replica Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">
          <span className="dark:text-text-dark-secondary light:text-text-light-secondary">Replicas: </span>
          <span className="dark:text-text-dark light:text-text-light font-medium">
            {deployment.replicas.ready}/{deployment.replicas.desired}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: deployment.replicas.desired }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < deployment.replicas.ready
                  ? 'bg-status-healthy'
                  : 'bg-status-critical'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pod Status */}
      <div className="space-y-2 mb-4">
        <div className="text-xs dark:text-text-dark-secondary light:text-text-light-secondary">Pod Status</div>
        <div className="flex flex-wrap gap-2">
          {podStatusCounts.Running > 0 && (
            <span className="px-2 py-1 text-xs rounded bg-status-healthy bg-opacity-10 text-status-healthy">
              {podStatusCounts.Running} Running
            </span>
          )}
          {podStatusCounts.Pending > 0 && (
            <span className="px-2 py-1 text-xs rounded bg-status-warning bg-opacity-10 text-status-warning">
              {podStatusCounts.Pending} Pending
            </span>
          )}
          {podStatusCounts.CrashLoopBackOff > 0 && (
            <span className="px-2 py-1 text-xs rounded bg-status-critical bg-opacity-10 text-status-critical">
              {podStatusCounts.CrashLoopBackOff} Crashing
            </span>
          )}
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs dark:text-text-dark-secondary light:text-text-light-secondary">CPU</div>
          <div className="text-sm font-medium dark:text-text-dark light:text-text-light">
            {deployment.cpu.current}m
          </div>
          <div className="text-xs dark:text-text-dark-secondary light:text-text-light-secondary">
            {deployment.cpu.request} / {deployment.cpu.limit}
          </div>
        </div>
        <div>
          <div className="text-xs dark:text-text-dark-secondary light:text-text-light-secondary">Memory</div>
          <div className="text-sm font-medium dark:text-text-dark light:text-text-light">
            {deployment.memory.current}Mi
          </div>
          <div className="text-xs dark:text-text-dark-secondary light:text-text-light-secondary">
            {deployment.memory.request} / {deployment.memory.limit}
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-3">
        <ResponsiveContainer width="100%" height={30}>
          <BarChart data={sparklineData}>
            <Bar dataKey="value" fill="#5794f2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs dark:text-text-dark-secondary light:text-text-light-secondary pt-3 border-t dark:border-border-dark light:border-border-light">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{format(deployment.lastUpdated, 'MMM dd, HH:mm')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3" />
          <span>Rev {deployment.revisions}</span>
        </div>
      </div>
    </div>
  );
};
