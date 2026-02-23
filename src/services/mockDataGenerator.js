import { faker } from '@faker-js/faker';
import { subHours, subMinutes, format } from 'date-fns';

const NAMESPACES = ['default', 'production', 'staging', 'monitoring', 'kube-system'];
const POD_STATUSES = ['Running', 'Pending', 'CrashLoopBackOff', 'Completed', 'Failed'];
const EVENT_TYPES = ['Normal', 'Warning'];

const CLUSTER_PROFILES = {
  'production-us-east-1': {
    seed: 1001,
    nodeCount: 5,
    microservices: [
      'api-gateway', 'auth-service', 'user-service', 'payment-service',
      'notification-service', 'analytics-service', 'inventory-service',
      'order-service', 'shipping-service', 'recommendation-service',
      'search-service', 'cdn-proxy',
    ],
    cpuRange: { min: 55, max: 92 },
    memoryRange: { min: 60, max: 88 },
    diskRange: { min: 50, max: 80 },
    networkInRange: { min: 200, max: 800 },
    networkOutRange: { min: 150, max: 700 },
    nodeCpuCapacities: [16, 16, 32, 32, 64],
    nodeMemoryCapacities: [64, 64, 128, 128, 256],
    nodeCpuRange: { min: 50, max: 90 },
    nodeMemRange: { min: 55, max: 85 },
    replicaCounts: [5, 4, 3, 6, 3, 4, 5, 4, 3, 4, 3, 2],
    namespaceDistribution: (i) => i < 5 ? 'production' : i < 9 ? 'default' : 'staging',
    k8sVersion: 'v1.28.5',
    containerRuntime: 'containerd://1.7.11',
    kernel: '5.15.0-91-generic',
    warningNodeIndex: 4,
    degradedDeploymentIndex: 2,
    alerts: [
      { severity: 'critical', title: 'High Memory Usage on node-5', message: 'Memory usage at 94% on worker-node-5', minutesAgo: 3 },
      { severity: 'warning', title: 'Pod CrashLoopBackOff', message: 'auth-service pod is restarting repeatedly', minutesAgo: 12 },
      { severity: 'warning', title: 'High CPU on node-1', message: 'CPU usage at 88% on worker-node-1', minutesAgo: 25 },
      { severity: 'info', title: 'Horizontal Pod Autoscaler triggered', message: 'api-gateway scaled from 3 to 5 replicas', minutesAgo: 45 },
    ],
    configMaps: [
      { id: 'app-config', name: 'app-config', namespace: 'production', dataKeys: ['database.url', 'redis.host', 'api.timeout', 'cache.ttl'], hoursAgo: 48 },
      { id: 'logging-config', name: 'logging-config', namespace: 'default', dataKeys: ['log.level', 'log.format', 'log.output'], hoursAgo: 120 },
      { id: 'feature-flags', name: 'feature-flags', namespace: 'production', dataKeys: ['feature.new-ui', 'feature.beta-api', 'feature.dark-mode', 'feature.recommendations-v2'], hoursAgo: 24 },
      { id: 'rate-limits', name: 'rate-limits', namespace: 'production', dataKeys: ['rate.global', 'rate.per-user', 'rate.burst'], hoursAgo: 72 },
    ],
    secrets: [
      { id: 'db-credentials', name: 'db-credentials', namespace: 'production', type: 'Opaque', keysCount: 4, hoursAgo: 720 },
      { id: 'api-keys', name: 'api-keys', namespace: 'production', type: 'Opaque', keysCount: 8, hoursAgo: 168 },
      { id: 'tls-cert', name: 'tls-cert', namespace: 'default', type: 'kubernetes.io/tls', keysCount: 2, hoursAgo: 2160 },
      { id: 'stripe-keys', name: 'stripe-keys', namespace: 'production', type: 'Opaque', keysCount: 3, hoursAgo: 336 },
    ],
    ingressRules: [
      { id: 'api-ingress', name: 'api-ingress', namespace: 'production', host: 'api.mycompany.com', paths: [{ path: '/v1/auth', backend: 'auth-service:8080' }, { path: '/v1/users', backend: 'user-service:8080' }, { path: '/v1/payments', backend: 'payment-service:8080' }], tls: true },
      { id: 'web-ingress', name: 'web-ingress', namespace: 'production', host: 'www.mycompany.com', paths: [{ path: '/', backend: 'frontend-service:80' }], tls: true },
      { id: 'admin-ingress', name: 'admin-ingress', namespace: 'default', host: 'admin.mycompany.com', paths: [{ path: '/', backend: 'admin-service:3000' }], tls: true },
      { id: 'cdn-ingress', name: 'cdn-ingress', namespace: 'production', host: 'cdn.mycompany.com', paths: [{ path: '/assets', backend: 'cdn-proxy:8080' }], tls: true },
    ],
    namespaceUsage: [
      { name: 'production', cpu: 78, memory: 85 },
      { name: 'default', cpu: 22, memory: 38 },
      { name: 'staging', cpu: 45, memory: 55 },
      { name: 'monitoring', cpu: 35, memory: 48 },
      { name: 'kube-system', cpu: 58, memory: 68 },
    ],
  },

  'staging-us-west-2': {
    seed: 2002,
    nodeCount: 3,
    microservices: [
      'api-gateway', 'auth-service', 'user-service', 'payment-service',
      'notification-service', 'analytics-service', 'order-service',
      'shipping-service',
    ],
    cpuRange: { min: 25, max: 65 },
    memoryRange: { min: 30, max: 60 },
    diskRange: { min: 30, max: 55 },
    networkInRange: { min: 50, max: 300 },
    networkOutRange: { min: 40, max: 250 },
    nodeCpuCapacities: [8, 8, 16],
    nodeMemoryCapacities: [32, 32, 64],
    nodeCpuRange: { min: 20, max: 65 },
    nodeMemRange: { min: 30, max: 60 },
    replicaCounts: [2, 2, 2, 2, 1, 2, 2, 1],
    namespaceDistribution: (i) => i < 3 ? 'staging' : i < 6 ? 'default' : 'monitoring',
    k8sVersion: 'v1.28.3',
    containerRuntime: 'containerd://1.6.26',
    kernel: '5.15.0-88-generic',
    warningNodeIndex: -1,
    degradedDeploymentIndex: -1,
    alerts: [
      { severity: 'warning', title: 'Staging Deploy Queued', message: 'Deployment pipeline waiting for approval', minutesAgo: 10 },
      { severity: 'info', title: 'New Image Pushed', message: 'auth-service:v2.4.0-rc1 pushed to registry', minutesAgo: 30 },
    ],
    configMaps: [
      { id: 'staging-config', name: 'staging-config', namespace: 'staging', dataKeys: ['database.url', 'redis.host', 'debug.enabled'], hoursAgo: 12 },
      { id: 'test-data-config', name: 'test-data-config', namespace: 'staging', dataKeys: ['seed.users', 'seed.orders', 'mock.payments'], hoursAgo: 48 },
      { id: 'feature-flags', name: 'feature-flags', namespace: 'staging', dataKeys: ['feature.experimental-ui', 'feature.new-checkout', 'feature.ai-recs'], hoursAgo: 6 },
    ],
    secrets: [
      { id: 'db-credentials-stg', name: 'db-credentials-stg', namespace: 'staging', type: 'Opaque', keysCount: 2, hoursAgo: 240 },
      { id: 'api-keys-stg', name: 'api-keys-stg', namespace: 'staging', type: 'Opaque', keysCount: 4, hoursAgo: 96 },
      { id: 'tls-cert-stg', name: 'tls-cert-stg', namespace: 'default', type: 'kubernetes.io/tls', keysCount: 2, hoursAgo: 720 },
    ],
    ingressRules: [
      { id: 'staging-api', name: 'staging-api', namespace: 'staging', host: 'api.staging.mycompany.com', paths: [{ path: '/v1', backend: 'api-gateway:8080' }], tls: true },
      { id: 'staging-web', name: 'staging-web', namespace: 'staging', host: 'staging.mycompany.com', paths: [{ path: '/', backend: 'frontend-service:80' }], tls: false },
    ],
    namespaceUsage: [
      { name: 'staging', cpu: 42, memory: 50 },
      { name: 'default', cpu: 15, memory: 22 },
      { name: 'monitoring', cpu: 18, memory: 25 },
      { name: 'kube-system', cpu: 30, memory: 38 },
    ],
  },

  'development-eu-central-1': {
    seed: 3003,
    nodeCount: 2,
    microservices: [
      'api-gateway', 'auth-service', 'user-service',
      'notification-service', 'analytics-service',
    ],
    cpuRange: { min: 10, max: 45 },
    memoryRange: { min: 15, max: 40 },
    diskRange: { min: 20, max: 40 },
    networkInRange: { min: 20, max: 150 },
    networkOutRange: { min: 15, max: 120 },
    nodeCpuCapacities: [4, 8],
    nodeMemoryCapacities: [16, 32],
    nodeCpuRange: { min: 10, max: 45 },
    nodeMemRange: { min: 15, max: 40 },
    replicaCounts: [1, 1, 1, 1, 1],
    namespaceDistribution: () => 'default',
    k8sVersion: 'v1.29.0',
    containerRuntime: 'containerd://1.7.13',
    kernel: '6.1.0-18-generic',
    warningNodeIndex: -1,
    degradedDeploymentIndex: -1,
    alerts: [
      { severity: 'info', title: 'Dev Cluster Idle', message: 'No deployments in last 2 hours', minutesAgo: 120 },
    ],
    configMaps: [
      { id: 'dev-config', name: 'dev-config', namespace: 'default', dataKeys: ['database.url', 'debug.enabled', 'hot-reload'], hoursAgo: 2 },
      { id: 'mock-data', name: 'mock-data', namespace: 'default', dataKeys: ['mock.enabled', 'mock.delay'], hoursAgo: 8 },
    ],
    secrets: [
      { id: 'db-credentials-dev', name: 'db-credentials-dev', namespace: 'default', type: 'Opaque', keysCount: 2, hoursAgo: 48 },
      { id: 'dev-tls', name: 'dev-tls', namespace: 'default', type: 'kubernetes.io/tls', keysCount: 2, hoursAgo: 168 },
    ],
    ingressRules: [
      { id: 'dev-api', name: 'dev-api', namespace: 'default', host: 'api.dev.mycompany.com', paths: [{ path: '/', backend: 'api-gateway:8080' }], tls: false },
    ],
    namespaceUsage: [
      { name: 'default', cpu: 18, memory: 22 },
      { name: 'kube-system', cpu: 12, memory: 18 },
    ],
  },
};

const DEFAULT_CLUSTER_ID = 'production-us-east-1';

function getProfile(clusterId) {
  return CLUSTER_PROFILES[clusterId] || CLUSTER_PROFILES[DEFAULT_CLUSTER_ID];
}

function seededFaker(clusterId) {
  const profile = getProfile(clusterId);
  faker.seed(profile.seed);
  return faker;
}

export const generateNodes = (clusterId) => {
  const profile = getProfile(clusterId);
  const f = seededFaker(clusterId);

  return Array.from({ length: profile.nodeCount }, (_, i) => {
    const cpuCapacity = profile.nodeCpuCapacities[i];
    const memoryCapacity = profile.nodeMemoryCapacities[i];
    const cpuUsagePercent = f.number.int(profile.nodeCpuRange);
    const memoryUsagePercent = f.number.int(profile.nodeMemRange);

    return {
      id: `node-${i + 1}`,
      name: `worker-node-${i + 1}`,
      status: i === profile.warningNodeIndex ? 'Warning' : 'Ready',
      roles: i === 0 ? ['master', 'worker'] : ['worker'],
      cpu: {
        capacity: cpuCapacity,
        used: (cpuCapacity * cpuUsagePercent / 100).toFixed(2),
        usagePercent: cpuUsagePercent,
      },
      memory: {
        capacity: memoryCapacity,
        used: (memoryCapacity * memoryUsagePercent / 100).toFixed(2),
        usagePercent: memoryUsagePercent,
      },
      pods: {
        capacity: 110,
        current: f.number.int({ min: 10, max: Math.min(35, profile.microservices.length * 5) }),
      },
      os: 'Linux',
      kernel: profile.kernel,
      containerRuntime: profile.containerRuntime,
      kubeletVersion: profile.k8sVersion,
      ip: f.internet.ipv4(),
      createdAt: subHours(new Date(), f.number.int({ min: 720, max: 8760 })),
    };
  });
};

export const generateDeployments = (clusterId) => {
  const profile = getProfile(clusterId);
  const f = seededFaker(clusterId);
  // Advance the seed past the node generation
  for (let i = 0; i < profile.nodeCount * 8; i++) f.number.int({ min: 0, max: 100 });

  return profile.microservices.map((service, i) => {
    const desiredReplicas = profile.replicaCounts[i] || 1;
    const isDegraded = i === profile.degradedDeploymentIndex;
    const readyReplicas = isDegraded ? Math.max(desiredReplicas - 1, 0) : desiredReplicas;

    return {
      id: service,
      name: service,
      namespace: profile.namespaceDistribution(i),
      replicas: {
        desired: desiredReplicas,
        ready: readyReplicas,
        available: readyReplicas,
      },
      image: `mycompany/${service}:v${f.number.int({ min: 1, max: 3 })}.${f.number.int({ min: 0, max: 9 })}.${f.number.int({ min: 0, max: 20 })}`,
      status: readyReplicas === desiredReplicas ? 'Healthy' : 'Degraded',
      lastUpdated: subHours(new Date(), f.number.int({ min: 2, max: 168 })),
      strategy: 'RollingUpdate',
      revisions: f.number.int({ min: 3, max: 30 }),
      livenessProbe: true,
      readinessProbe: true,
      cpu: {
        request: '100m',
        limit: '500m',
        current: f.number.int({ min: 60, max: 400 }),
      },
      memory: {
        request: '128Mi',
        limit: '512Mi',
        current: f.number.int({ min: 100, max: 450 }),
      },
    };
  });
};

export const generatePods = (deployments, clusterId) => {
  const profile = getProfile(clusterId);
  const f = seededFaker(clusterId);
  // Advance past previous generators
  for (let i = 0; i < 200; i++) f.number.int({ min: 0, max: 100 });

  const pods = [];

  deployments.forEach(deployment => {
    for (let i = 0; i < deployment.replicas.desired; i++) {
      const isUnhealthy = i === deployment.replicas.desired - 1 && deployment.replicas.ready < deployment.replicas.desired;

      pods.push({
        id: `${deployment.name}-${f.string.alphanumeric(10)}`,
        name: `${deployment.name}-${f.string.alphanumeric(10)}`,
        namespace: deployment.namespace,
        deployment: deployment.name,
        status: isUnhealthy ? 'CrashLoopBackOff' : 'Running',
        node: `worker-node-${f.number.int({ min: 1, max: profile.nodeCount })}`,
        restarts: isUnhealthy ? f.number.int({ min: 5, max: 20 }) : f.number.int({ min: 0, max: 3 }),
        age: subHours(new Date(), f.number.int({ min: 1, max: 240 })),
        ip: f.internet.ipv4(),
        cpu: f.number.int({ min: 50, max: 400 }),
        memory: f.number.int({ min: 100, max: 450 }),
      });
    }
  });

  return pods;
};

const TIME_RANGE_CONFIG = {
  '1h':  { hours: 1,  intervalMinutes: 2,  formatStr: 'HH:mm' },
  '6h':  { hours: 6,  intervalMinutes: 15, formatStr: 'HH:mm' },
  '12h': { hours: 12, intervalMinutes: 30, formatStr: 'HH:mm' },
  '24h': { hours: 24, intervalMinutes: 60, formatStr: 'HH:mm' },
};

export const generateTimeSeriesData = (clusterId, timeRange = '24h') => {
  const profile = getProfile(clusterId);
  const config = TIME_RANGE_CONFIG[timeRange] || TIME_RANGE_CONFIG['24h'];
  const totalMinutes = config.hours * 60;
  const dataPoints = [];
  const now = new Date();

  // Use a unique seed per cluster + time range so data is stable
  const rangeSeed = profile.seed + timeRange.charCodeAt(0);
  faker.seed(rangeSeed);

  for (let m = totalMinutes; m >= 0; m -= config.intervalMinutes) {
    const timestamp = subMinutes(now, m);
    dataPoints.push({
      timestamp: format(timestamp, config.formatStr),
      fullTimestamp: timestamp,
      cpu: faker.number.int(profile.cpuRange),
      memory: faker.number.int(profile.memoryRange),
      disk: faker.number.int(profile.diskRange),
      networkIn: faker.number.int(profile.networkInRange),
      networkOut: faker.number.int(profile.networkOutRange),
    });
  }

  return dataPoints;
};

export const generateEvents = (clusterId, count = 50) => {
  const profile = getProfile(clusterId);
  faker.seed(profile.seed + 500);

  const warningReasons = ['FailedScheduling', 'BackOff', 'Unhealthy', 'FailedMount', 'OOMKilling'];
  const normalReasons = ['Scheduled', 'Pulling', 'Pulled', 'Created', 'Started', 'ScaledUp'];
  const warningMessages = [
    '0/3 nodes are available: insufficient memory.',
    'Back-off restarting failed container',
    'Liveness probe failed: HTTP probe failed',
    'Unable to mount volumes',
    'Container exceeded memory limit',
  ];
  const normalMessages = [
    'Successfully assigned pod to node',
    'Pulling image from registry',
    'Successfully pulled image',
    'Created container',
    'Started container',
    'New replica set scaled up',
  ];

  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(EVENT_TYPES);
    const isWarning = type === 'Warning';

    return {
      id: faker.string.uuid(),
      type,
      reason: faker.helpers.arrayElement(isWarning ? warningReasons : normalReasons),
      message: faker.helpers.arrayElement(isWarning ? warningMessages : normalMessages),
      namespace: faker.helpers.arrayElement(NAMESPACES),
      object: `${faker.helpers.arrayElement(profile.microservices)}-${faker.string.alphanumeric(10)}`,
      timestamp: subMinutes(new Date(), faker.number.int({ min: 1, max: 1440 })),
      count: faker.number.int({ min: 1, max: 10 }),
    };
  }).sort((a, b) => b.timestamp - a.timestamp);
};

export const generateConfigMaps = (clusterId) => {
  const profile = getProfile(clusterId);
  return profile.configMaps.map(cm => ({
    ...cm,
    keysCount: cm.dataKeys.length,
    lastModified: subHours(new Date(), cm.hoursAgo),
  }));
};

export const generateSecrets = (clusterId) => {
  const profile = getProfile(clusterId);
  return profile.secrets.map(s => ({
    ...s,
    lastModified: subHours(new Date(), s.hoursAgo),
  }));
};

export const generateIngressRules = (clusterId) => {
  const profile = getProfile(clusterId);
  return profile.ingressRules;
};

export const generateServices = (clusterId) => {
  const profile = getProfile(clusterId);
  faker.seed(profile.seed + 700);

  return profile.microservices.map(service => ({
    id: service,
    name: service,
    namespace: profile.namespaceDistribution(profile.microservices.indexOf(service)),
    type: faker.helpers.arrayElement(['ClusterIP', 'NodePort', 'LoadBalancer']),
    clusterIP: faker.internet.ipv4(),
    ports: [
      { name: 'http', port: 8080, targetPort: 8080, protocol: 'TCP' },
    ],
    selector: { app: service },
  }));
};

export const generateAlerts = (clusterId) => {
  const profile = getProfile(clusterId);
  return profile.alerts.map((alert, i) => ({
    id: String(i + 1),
    severity: alert.severity,
    title: alert.title,
    message: alert.message,
    timestamp: subMinutes(new Date(), alert.minutesAgo),
    acknowledged: i >= 2,
  }));
};

export const getNamespaceUsage = (clusterId) => {
  const profile = getProfile(clusterId);
  return profile.namespaceUsage;
};

export const getClusterStats = (nodes, pods, deployments, clusterId) => {
  const profile = getProfile(clusterId);
  const runningPods = pods.filter(p => p.status === 'Running').length;
  const pendingPods = pods.filter(p => p.status === 'Pending').length;
  const failedPods = pods.filter(p => p.status === 'CrashLoopBackOff' || p.status === 'Failed').length;

  const healthyNodes = nodes.filter(n => n.status === 'Ready').length;
  const totalCPU = nodes.reduce((sum, n) => sum + n.cpu.capacity, 0);
  const usedCPU = nodes.reduce((sum, n) => sum + parseFloat(n.cpu.used), 0);
  const totalMemory = nodes.reduce((sum, n) => sum + n.memory.capacity, 0);
  const usedMemory = nodes.reduce((sum, n) => sum + parseFloat(n.memory.used), 0);

  return {
    clusterHealth: healthyNodes === nodes.length ? 'Healthy' : 'Warning',
    nodes: {
      total: nodes.length,
      healthy: healthyNodes,
      unhealthy: nodes.length - healthyNodes,
    },
    pods: {
      total: pods.length,
      running: runningPods,
      pending: pendingPods,
      failed: failedPods,
    },
    resources: {
      cpu: {
        total: totalCPU,
        used: usedCPU.toFixed(2),
        usagePercent: ((usedCPU / totalCPU) * 100).toFixed(1),
      },
      memory: {
        total: totalMemory,
        used: usedMemory.toFixed(2),
        usagePercent: ((usedMemory / totalMemory) * 100).toFixed(1),
      },
    },
    namespaces: NAMESPACES.length,
    deployments: deployments.length,
    services: profile.microservices.length,
  };
};
