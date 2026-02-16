import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDashboardStore = create(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      // Selected cluster
      selectedCluster: 'production-us-east-1',
      setSelectedCluster: (cluster) => set({ selectedCluster: cluster }),
      
      // Filters
      selectedNamespace: 'all',
      setSelectedNamespace: (namespace) => set({ selectedNamespace: namespace }),
      
      selectedNode: null,
      setSelectedNode: (node) => set({ selectedNode: node }),
      
      selectedDeployment: null,
      setSelectedDeployment: (deployment) => set({ selectedDeployment: deployment }),
      
      // Settings
      settings: {
        refreshInterval: 30, // seconds
        cpuWarningThreshold: 70, // percentage
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
