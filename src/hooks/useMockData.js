import { useState, useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import {
  generateNodes,
  generateDeployments,
  generatePods,
  generateTimeSeriesData,
  generateEvents,
  generateConfigMaps,
  generateSecrets,
  generateIngressRules,
  generateServices,
  generateAlerts,
  getClusterStats,
  getNamespaceUsage,
} from '../services/mockDataGenerator';

export const useMockData = () => {
  const selectedCluster = useDashboardStore((s) => s.selectedCluster);
  const timeRange = useDashboardStore((s) => s.timeRange);

  const [data, setData] = useState({
    nodes: [],
    deployments: [],
    pods: [],
    timeSeriesData: [],
    events: [],
    configMaps: [],
    secrets: [],
    ingressRules: [],
    services: [],
    alerts: [],
    stats: null,
    namespaceUsage: [],
  });

  useEffect(() => {
    const clusterId = selectedCluster || 'production-us-east-1';

    const nodes = generateNodes(clusterId);
    const deployments = generateDeployments(clusterId);
    const pods = generatePods(deployments, clusterId);
    const timeSeriesData = generateTimeSeriesData(clusterId, timeRange);
    const events = generateEvents(clusterId, 50);
    const configMaps = generateConfigMaps(clusterId);
    const secrets = generateSecrets(clusterId);
    const ingressRules = generateIngressRules(clusterId);
    const services = generateServices(clusterId);
    const alerts = generateAlerts(clusterId);
    const stats = getClusterStats(nodes, pods, deployments, clusterId);
    const namespaceUsage = getNamespaceUsage(clusterId);

    setData({
      nodes,
      deployments,
      pods,
      timeSeriesData,
      events,
      configMaps,
      secrets,
      ingressRules,
      services,
      alerts,
      stats,
      namespaceUsage,
    });

    const interval = setInterval(() => {
      const updatedTimeSeriesData = generateTimeSeriesData(clusterId, timeRange);
      const updatedAlerts = generateAlerts(clusterId);
      const updatedStats = getClusterStats(nodes, pods, deployments, clusterId);

      setData(prev => ({
        ...prev,
        timeSeriesData: updatedTimeSeriesData,
        alerts: updatedAlerts,
        stats: updatedStats,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedCluster, timeRange]);

  return data;
};
