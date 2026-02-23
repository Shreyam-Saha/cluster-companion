import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultClusters = [
  {
    id: 'production-us-east-1',
    name: 'prod-us-east-1',
    environment: 'Production',
    provider: 'aws',
    apiEndpoint: 'https://api.k8s.prod-us-east-1.example.com:6443',
    k8sVersion: 'v1.28.5',
    authMethod: 'token',
    bearerToken: '',
    clientCertificate: '',
    clientKey: '',
    caCertificate: '',
    kubeconfig: '',
    skipTlsVerify: false,
    connectionStatus: 'disconnected',
  },
  {
    id: 'staging-us-west-2',
    name: 'stg-us-west-2',
    environment: 'Staging',
    provider: 'aws',
    apiEndpoint: 'https://api.k8s.stg-us-west-2.example.com:6443',
    k8sVersion: 'v1.28.3',
    authMethod: 'token',
    bearerToken: '',
    clientCertificate: '',
    clientKey: '',
    caCertificate: '',
    kubeconfig: '',
    skipTlsVerify: false,
    connectionStatus: 'disconnected',
  },
  {
    id: 'development-eu-central-1',
    name: 'dev-eu-central-1',
    environment: 'Development',
    provider: 'aws',
    apiEndpoint: 'https://api.k8s.dev-eu-central-1.example.com:6443',
    k8sVersion: 'v1.29.0',
    authMethod: 'token',
    bearerToken: '',
    clientCertificate: '',
    clientKey: '',
    caCertificate: '',
    kubeconfig: '',
    skipTlsVerify: false,
    connectionStatus: 'disconnected',
  },
];

export const useDashboardStore = create(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      // Clusters
      clusters: defaultClusters,
      selectedCluster: 'production-us-east-1',
      setSelectedCluster: (cluster) => set({ selectedCluster: cluster }),
      addCluster: (cluster) => set((state) => ({
        clusters: [...state.clusters, cluster],
      })),
      updateCluster: (id, updates) => set((state) => ({
        clusters: state.clusters.map(c => c.id === id ? { ...c, ...updates } : c),
      })),
      removeCluster: (id) => set((state) => ({
        clusters: state.clusters.filter(c => c.id !== id),
        selectedCluster: state.selectedCluster === id
          ? (state.clusters.find(c => c.id !== id)?.id || '')
          : state.selectedCluster,
      })),
      
      // Filters
      selectedNamespace: 'all',
      setSelectedNamespace: (namespace) => set({ selectedNamespace: namespace }),
      
      selectedNode: null,
      setSelectedNode: (node) => set({ selectedNode: node }),
      
      selectedDeployment: null,
      setSelectedDeployment: (deployment) => set({ selectedDeployment: deployment }),
      
      // Time range for charts
      timeRange: '24h',
      setTimeRange: (range) => set({ timeRange: range }),

      // Settings
      settings: {
        refreshInterval: 30,
        cpuWarningThreshold: 70,
        cpuCriticalThreshold: 90,
        memoryWarningThreshold: 75,
        memoryCriticalThreshold: 90,
        emailNotifications: true,
        slackNotifications: false,
        webhookNotifications: false,
        defaultTimeRange: '24h',
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'k8s-dashboard-storage',
    }
  )
);
