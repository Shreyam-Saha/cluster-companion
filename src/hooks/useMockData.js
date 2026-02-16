import { useState, useEffect } from 'react';
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
} from '../services/mockDataGenerator';

export const useMockData = () => {
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
  });

  useEffect(() => {
    // Generate initial data
    const nodes = generateNodes(3);
    const deployments = generateDeployments();
    const pods = generatePods(deployments);
    const timeSeriesData = generateTimeSeriesData(24, 1);
    const events = generateEvents(50);
    const configMaps = generateConfigMaps();
    const secrets = generateSecrets();
    const ingressRules = generateIngressRules();
    const services = generateServices();
    const alerts = generateAlerts();
    const stats = getClusterStats(nodes, pods, deployments);

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
    });

    // Simulate periodic updates to make the dashboard feel dynamic
    const interval = setInterval(() => {
      const updatedTimeSeriesData = generateTimeSeriesData(24, 1);
      const updatedAlerts = generateAlerts();
      const updatedStats = getClusterStats(nodes, pods, deployments);
      
      setData(prev => ({
        ...prev,
        timeSeriesData: updatedTimeSeriesData,
        alerts: updatedAlerts,
        stats: updatedStats,
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return data;
};
