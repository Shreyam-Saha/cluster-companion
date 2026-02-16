import { useState } from 'react';
import { FileCode, Lock, Globe, Layers, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { YamlViewer } from '../components/configurations/YamlViewer';
import { useMockData } from '../hooks/useMockData';

export const Configurations = () => {
  const { configMaps, secrets, ingressRules, services } = useMockData();
  const [selectedItem, setSelectedItem] = useState(null);

  const generateConfigMapYaml = (configMap) => {
    return `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${configMap.name}
  namespace: ${configMap.namespace}
data:
${configMap.dataKeys.map(key => `  ${key}: "value-here"`).join('\n')}`;
  };

  const generateSecretYaml = (secret) => {
    return `apiVersion: v1
kind: Secret
metadata:
  name: ${secret.name}
  namespace: ${secret.namespace}
type: ${secret.type}
data:
  # Values are base64 encoded
  key1: "***REDACTED***"
  key2: "***REDACTED***"`;
  };

  const generateIngressYaml = (ingress) => {
    return `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${ingress.name}
  namespace: ${ingress.namespace}
spec:
  ${ingress.tls ? `tls:
  - hosts:
    - ${ingress.host}
    secretName: tls-secret
  ` : ''}rules:
  - host: ${ingress.host}
    http:
      paths:
${ingress.paths.map(p => `      - path: ${p.path}
        pathType: Prefix
        backend:
          service:
            name: ${p.backend.split(':')[0]}
            port:
              number: ${p.backend.split(':')[1]}`).join('\n')}`;
  };

  const generateServiceYaml = (service) => {
    return `apiVersion: v1
kind: Service
metadata:
  name: ${service.name}
  namespace: ${service.namespace}
spec:
  type: ${service.type}
  selector:
    app: ${service.selector.app}
  ports:
${service.ports.map(p => `  - name: ${p.name}
    port: ${p.port}
    targetPort: ${p.targetPort}
    protocol: ${p.protocol}`).join('\n')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-text-dark light:text-text-light">
          Configurations
        </h1>
        <p className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary mt-1">
          ConfigMaps, secrets, ingress rules, and Services
        </p>
      </div>

      {/* ConfigMaps */}
      <div className="card">
        <div className="p-4 border-b dark:border-border-dark light:border-border-light">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 dark:text-text-dark light:text-text-light" />
            <h2 className="text-lg font-semibold dark:text-text-dark light:text-text-light">
              ConfigMaps
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dark:bg-surface-dark-hover light:bg-surface-light-hover">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Namespace
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Data Keys
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-border-dark light:divide-border-light">
              {configMaps.map((cm) => (
                <tr key={cm.id} className="hover:dark:bg-surface-dark-hover hover:light:bg-surface-light-hover">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium dark:text-text-dark light:text-text-light">
                      {cm.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded dark:bg-surface-dark-hover light:bg-surface-light-hover dark:text-text-dark light:text-text-light">
                      {cm.namespace}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
                      {cm.keysCount} keys
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
                      {format(cm.lastModified, 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedItem({ type: 'configmap', data: cm })}
                      className="flex items-center space-x-1 text-sm text-accent-primary hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View YAML</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secrets */}
      <div className="card">
        <div className="p-4 border-b dark:border-border-dark light:border-border-light">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 dark:text-text-dark light:text-text-light" />
            <h2 className="text-lg font-semibold dark:text-text-dark light:text-text-light">
              Secrets
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dark:bg-surface-dark-hover light:bg-surface-light-hover">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Namespace
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Keys
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-border-dark light:divide-border-light">
              {secrets.map((secret) => (
                <tr key={secret.id} className="hover:dark:bg-surface-dark-hover hover:light:bg-surface-light-hover">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium dark:text-text-dark light:text-text-light">
                      {secret.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded dark:bg-surface-dark-hover light:bg-surface-light-hover dark:text-text-dark light:text-text-light">
                      {secret.namespace}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
                      {secret.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
                      {secret.keysCount} keys
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedItem({ type: 'secret', data: secret })}
                      className="flex items-center space-x-1 text-sm text-accent-primary hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View YAML</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingress Rules */}
      <div className="card">
        <div className="p-4 border-b dark:border-border-dark light:border-border-light">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 dark:text-text-dark light:text-text-light" />
            <h2 className="text-lg font-semibold dark:text-text-dark light:text-text-light">
              Ingress Rules
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dark:bg-surface-dark-hover light:bg-surface-light-hover">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Host
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Paths
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  TLS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-border-dark light:divide-border-light">
              {ingressRules.map((ingress) => (
                <tr key={ingress.id} className="hover:dark:bg-surface-dark-hover hover:light:bg-surface-light-hover">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium dark:text-text-dark light:text-text-light">
                      {ingress.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-accent-primary">
                      {ingress.host}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
                      {ingress.paths.length} path(s)
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      ingress.tls
                        ? 'bg-status-healthy bg-opacity-10 text-status-healthy'
                        : 'bg-status-unknown bg-opacity-10 text-status-unknown'
                    }`}>
                      {ingress.tls ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedItem({ type: 'ingress', data: ingress })}
                      className="flex items-center space-x-1 text-sm text-accent-primary hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View YAML</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services */}
      <div className="card">
        <div className="p-4 border-b dark:border-border-dark light:border-border-light">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 dark:text-text-dark light:text-text-light" />
            <h2 className="text-lg font-semibold dark:text-text-dark light:text-text-light">
              Services
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dark:bg-surface-dark-hover light:bg-surface-light-hover">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Cluster IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Ports
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium dark:text-text-dark-secondary light:text-text-light-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-border-dark light:divide-border-light">
              {services.map((service) => (
                <tr key={service.id} className="hover:dark:bg-surface-dark-hover hover:light:bg-surface-light-hover">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium dark:text-text-dark light:text-text-light">
                      {service.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded dark:bg-surface-dark-hover light:bg-surface-light-hover dark:text-text-dark light:text-text-light">
                      {service.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary font-mono">
                      {service.clusterIP}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
                      {service.ports.map(p => p.port).join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedItem({ type: 'service', data: service })}
                      className="flex items-center space-x-1 text-sm text-accent-primary hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View YAML</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* YAML Viewer Modal */}
      {selectedItem && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedItem(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <YamlViewer
                yaml={
                  selectedItem.type === 'configmap'
                    ? generateConfigMapYaml(selectedItem.data)
                    : selectedItem.type === 'secret'
                    ? generateSecretYaml(selectedItem.data)
                    : selectedItem.type === 'ingress'
                    ? generateIngressYaml(selectedItem.data)
                    : generateServiceYaml(selectedItem.data)
                }
                title={`${selectedItem.type.toUpperCase()}: ${selectedItem.data.name}`}
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 w-full px-4 py-2 rounded-lg dark:bg-surface-dark light:bg-surface-light hover:opacity-80"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
