import { useState } from 'react';
import { FileCode, Lock, Globe, Layers, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { YamlViewer } from '../components/configurations/YamlViewer';
import { useMockData } from '../hooks/useMockData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const ConfigTable = ({ icon: Icon, title, columns, data, renderRow }) => (
    <Card className="shadow-card overflow-hidden">
      <CardHeader className="border-b py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <Badge variant="secondary" className="text-[10px] ml-auto">{data.length}</Badge>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="text-xs">{col}</TableHead>
              ))}
              <TableHead className="text-xs w-[80px] sm:w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(renderRow)}
          </TableBody>
        </Table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Configurations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ConfigMaps, Secrets, Ingress rules, and Services
        </p>
      </div>

      {/* ConfigMaps */}
      <ConfigTable
        icon={FileCode}
        title="ConfigMaps"
        columns={['Name', 'Namespace', 'Keys', 'Last Modified']}
        data={configMaps}
        renderRow={(cm) => (
          <TableRow key={cm.id}>
            <TableCell className="font-medium text-sm">{cm.name}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-[10px] font-mono">{cm.namespace}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">{cm.keysCount} keys</TableCell>
            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
              {format(cm.lastModified, 'MMM dd, yyyy')}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-primary px-2"
                onClick={() => setSelectedItem({ type: 'configmap', data: cm })}
              >
                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">YAML</span>
              </Button>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Secrets */}
      <ConfigTable
        icon={Lock}
        title="Secrets"
        columns={['Name', 'Namespace', 'Type', 'Keys']}
        data={secrets}
        renderRow={(secret) => (
          <TableRow key={secret.id}>
            <TableCell className="font-medium text-sm">{secret.name}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-[10px] font-mono">{secret.namespace}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs font-mono">{secret.type}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{secret.keysCount} keys</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-primary px-2"
                onClick={() => setSelectedItem({ type: 'secret', data: secret })}
              >
                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">YAML</span>
              </Button>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Ingress */}
      <ConfigTable
        icon={Globe}
        title="Ingress Rules"
        columns={['Name', 'Host', 'Paths', 'TLS']}
        data={ingressRules}
        renderRow={(ingress) => (
          <TableRow key={ingress.id}>
            <TableCell className="font-medium text-sm">{ingress.name}</TableCell>
            <TableCell className="font-mono text-xs text-primary truncate max-w-[160px]">{ingress.host}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{ingress.paths.length} path(s)</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`text-[10px] border-0 ${
                  ingress.tls
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {ingress.tls ? 'Enabled' : 'Disabled'}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-primary px-2"
                onClick={() => setSelectedItem({ type: 'ingress', data: ingress })}
              >
                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">YAML</span>
              </Button>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Services */}
      <ConfigTable
        icon={Layers}
        title="Services"
        columns={['Name', 'Type', 'Cluster IP', 'Ports']}
        data={services}
        renderRow={(service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium text-sm">{service.name}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-[10px]">{service.type}</Badge>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{service.clusterIP}</TableCell>
            <TableCell className="text-muted-foreground text-xs tabular-nums">{service.ports.map(p => p.port).join(', ')}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-primary px-2"
                onClick={() => setSelectedItem({ type: 'service', data: service })}
              >
                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">YAML</span>
              </Button>
            </TableCell>
          </TableRow>
        )}
      />

      {/* YAML Viewer Modal */}
      {selectedItem && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col gap-3">
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
              <Button
                variant="secondary"
                onClick={() => setSelectedItem(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
