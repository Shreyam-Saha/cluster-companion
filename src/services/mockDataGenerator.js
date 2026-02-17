import { faker } from '@faker-js/faker';
import { subHours, subMinutes, format } from 'date-fns';

// Microservices list
const MICROSERVICES = [
  'api-gateway',
  'auth-service',
  'user-service',
  'payment-service',
  'notification-service',
  'analytics-service',
  'inventory-service',
  'order-service',
  'shipping-service',
  'recommendation-service',
];

const NAMESPACES = ['default', 'production', 'staging', 'monitoring', 'kube-system'];

const POD_STATUSES = ['Running', 'Pending', 'CrashLoopBackOff', 'Completed', 'Failed'];

const EVENT_TYPES = ['Normal', 'Warning'];

// Generate nodes
export const generateNodes = (count = 3) => {
  return Array.from({ length: count }, (_, i) => {
    const cpuCapacity = [4, 8, 16][i % 3];
    const memoryCapacity = [16, 32, 64][i % 3];
    const cpuUsagePercent = faker.number.int({ min: 30, max: 85 });
    const memoryUsagePercent = faker.number.int({ min: 40, max: 80 });
    
    return {
      id: `node-${i + 1}`,
      name: `worker-node-${i + 1}`,
      status: i === 2 ? 'Warning' : 'Ready',
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
        current: faker.number.int({ min: 15, max: 35 }),
      },
      os: 'Linux',
      kernel: '5.15.0-91-generic',
      containerRuntime: 'containerd://1.6.26',
      kubeletVersion: 'v1.28.5',
      ip: faker.internet.ipv4(),
      createdAt: subHours(new Date(), faker.number.int({ min: 720, max: 8760 })),
    };
  });
};

// Generate deployments
export const generateDeployments = () => {
  return MICROSERVICES.map((service, i) => {
    const desiredReplicas = [3, 5, 2, 4, 3, 2, 3, 4, 2, 3][i];
    const readyReplicas = i === 2 ? desiredReplicas - 1 : desiredReplicas; // auth-service has 1 failed pod
    
    return {
      id: service,
      name: service,
      namespace: i < 3 ? 'production' : i < 7 ? 'default' : 'staging',
      replicas: {
        desired: desiredReplicas,
        ready: readyReplicas,
        available: readyReplicas,
      },
      image: `mycompany/${service}:v${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 20 })}`,
      status: readyReplicas === desiredReplicas ? 'Healthy' : 'Degraded',
      lastUpdated: subHours(new Date(), faker.number.int({ min: 2, max: 168 })),
      strategy: 'RollingUpdate',
      revisions: faker.number.int({ min: 5, max: 25 }),
      livenessProbe: true,
      readinessProbe: true,
      cpu: {
        request: '100m',
        limit: '500m',
        current: faker.number.int({ min: 80, max: 400 }),
      },
      memory: {
        request: '128Mi',
        limit: '512Mi',
        current: faker.number.int({ min: 150, max: 450 }),
      },
    };
  });
};

// Generate pods for deployments
export const generatePods = (deployments) => {
  const pods = [];
  
  deployments.forEach(deployment => {
    for (let i = 0; i < deployment.replicas.desired; i++) {
      const isUnhealthy = i === deployment.replicas.desired - 1 && deployment.replicas.ready < deployment.replicas.desired;
      
      pods.push({
        id: `${deployment.name}-${faker.string.alphanumeric(10)}`,
        name: `${deployment.name}-${faker.string.alphanumeric(10)}`,
        namespace: deployment.namespace,
        deployment: deployment.name,
        status: isUnhealthy ? 'CrashLoopBackOff' : 'Running',
        node: `worker-node-${faker.number.int({ min: 1, max: 3 })}`,
        restarts: isUnhealthy ? faker.number.int({ min: 5, max: 20 }) : faker.number.int({ min: 0, max: 3 }),
        age: subHours(new Date(), faker.number.int({ min: 1, max: 240 })),
        ip: faker.internet.ipv4(),
        cpu: faker.number.int({ min: 50, max: 400 }),
        memory: faker.number.int({ min: 100, max: 450 }),
      });
    }
  });
  
  return pods;
};

// Generate time-series data for charts
export const generateTimeSeriesData = (hours = 24, interval = 1) => {
  const dataPoints = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i -= interval) {
    const timestamp = subHours(now, i);
    dataPoints.push({
      timestamp: format(timestamp, 'HH:mm'),
      fullTimestamp: timestamp,
      cpu: faker.number.int({ min: 30, max: 85 }),
      memory: faker.number.int({ min: 40, max: 80 }),
      disk: faker.number.int({ min: 45, max: 75 }),
      networkIn: faker.number.int({ min: 100, max: 500 }),
      networkOut: faker.number.int({ min: 80, max: 400 }),
    });
  }
  
  return dataPoints;
};

// Generate events
export const generateEvents = (count = 50) => {
  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(EVENT_TYPES);
    const isWarning = type === 'Warning';
    
    const reasons = isWarning 
      ? ['FailedScheduling', 'BackOff', 'Unhealthy', 'FailedMount']
      : ['Scheduled', 'Pulling', 'Pulled', 'Created', 'Started'];
    
    const messages = isWarning
      ? [
          '0/3 nodes are available: insufficient memory.',
          'Back-off restarting failed container',
          'Liveness probe failed: HTTP probe failed',
          'Unable to mount volumes',
        ]
      : [
          'Successfully assigned pod to node',
          'Pulling image from registry',
          'Successfully pulled image',
          'Created container',
          'Started container',
        ];
    
    return {
      id: faker.string.uuid(),
      type,
      reason: faker.helpers.arrayElement(reasons),
      message: faker.helpers.arrayElement(messages),
      namespace: faker.helpers.arrayElement(NAMESPACES),
      object: `${faker.helpers.arrayElement(MICROSERVICES)}-${faker.string.alphanumeric(10)}`,
      timestamp: subMinutes(new Date(), faker.number.int({ min: 1, max: 1440 })),
      count: faker.number.int({ min: 1, max: 10 }),
    };
  }).sort((a, b) => b.timestamp - a.timestamp);
};

// Generate ConfigMaps
export const generateConfigMaps = () => {
  return [
    {
      id: 'app-config',
      name: 'app-config',
      namespace: 'production',
      dataKeys: ['database.url', 'redis.host', 'api.timeout'],
      keysCount: 3,
      lastModified: subHours(new Date(), 48),
    },
    {
      id: 'logging-config',
      name: 'logging-config',
      namespace: 'default',
      dataKeys: ['log.level', 'log.format'],
      keysCount: 2,
      lastModified: subHours(new Date(), 120),
    },
    {
      id: 'feature-flags',
      name: 'feature-flags',
      namespace: 'production',
      dataKeys: ['feature.new-ui', 'feature.beta-api', 'feature.dark-mode'],
      keysCount: 3,
      lastModified: subHours(new Date(), 24),
    },
  ];
};

// Generate Secrets
export const generateSecrets = () => {
  return [
    {
      id: 'db-credentials',
      name: 'db-credentials',
      namespace: 'production',
      type: 'Opaque',
      keysCount: 2,
      lastModified: subHours(new Date(), 720),
    },
    {
      id: 'api-keys',
      name: 'api-keys',
      namespace: 'production',
      type: 'Opaque',
      keysCount: 5,
      lastModified: subHours(new Date(), 168),
    },
    {
      id: 'tls-cert',
      name: 'tls-cert',
      namespace: 'default',
      type: 'kubernetes.io/tls',
      keysCount: 2,
      lastModified: subHours(new Date(), 2160),
    },
  ];
};

// Generate Ingress rules
export const generateIngressRules = () => {
  return [
    {
      id: 'api-ingress',
      name: 'api-ingress',
      namespace: 'production',
      host: 'api.mycompany.com',
      paths: [
        { path: '/v1/auth', backend: 'auth-service:8080' },
        { path: '/v1/users', backend: 'user-service:8080' },
        { path: '/v1/payments', backend: 'payment-service:8080' },
      ],
      tls: true,
    },
    {
      id: 'web-ingress',
      name: 'web-ingress',
      namespace: 'production',
      host: 'www.mycompany.com',
      paths: [
        { path: '/', backend: 'frontend-service:80' },
      ],
      tls: true,
    },
    {
      id: 'admin-ingress',
      name: 'admin-ingress',
      namespace: 'default',
      host: 'admin.mycompany.com',
      paths: [
        { path: '/', backend: 'admin-service:3000' },
      ],
      tls: false,
    },
  ];
};

// Generate Services
export const generateServices = () => {
  return MICROSERVICES.map(service => ({
    id: service,
    name: service,
    namespace: 'production',
    type: faker.helpers.arrayElement(['ClusterIP', 'NodePort', 'LoadBalancer']),
    clusterIP: faker.internet.ipv4(),
    ports: [
      { name: 'http', port: 8080, targetPort: 8080, protocol: 'TCP' },
    ],
    selector: {
      app: service,
    },
  }));
};

// Generate alerts
export const generateAlerts = () => {
  return [
    {
      id: '1',
      severity: 'critical',
      title: 'High Memory Usage on node-3',
      message: 'Memory usage is at 92% on worker-node-3',
      timestamp: subMinutes(new Date(), 5),
      acknowledged: false,
    },
    {
      id: '2',
      severity: 'warning',
      title: 'Pod CrashLoopBackOff',
      message: 'auth-service pod is restarting repeatedly',
      timestamp: subMinutes(new Date(), 15),
      acknowledged: false,
    },
    {
      id: '3',
      severity: 'warning',
      title: 'High CPU Usage',
      message: 'CPU usage is at 85% on worker-node-1',
      timestamp: subMinutes(new Date(), 30),
      acknowledged: true,
    },
  ];
};

// Get cluster summary stats
export const getClusterStats = (nodes, pods, deployments) => {
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
    services: MICROSERVICES.length,
  };
};
