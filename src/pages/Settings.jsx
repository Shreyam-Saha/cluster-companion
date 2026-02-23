import { useState, useEffect, useCallback } from 'react';
import {
  Bell, Save, Server, Palette, Clock, Plus, Trash2, Pencil, Check, X,
  Shield, Key, FileKey2, FileText, Loader2, CheckCircle2, XCircle, Wifi, WifiOff,
  Eye, EyeOff, Upload, Info, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const emptyCluster = {
  name: '',
  environment: 'Production',
  provider: '',
  apiEndpoint: '',
  k8sVersion: '',
  authMethod: 'token',
  bearerToken: '',
  clientCertificate: '',
  clientKey: '',
  caCertificate: '',
  kubeconfig: '',
  skipTlsVerify: false,
  connectionStatus: 'disconnected',
};

const providers = [
  { value: 'aws', label: 'AWS (EKS)' },
  { value: 'azure', label: 'Azure (AKS)' },
  { value: 'gcp', label: 'Google Cloud (GKE)' },
  { value: 'onprem', label: 'On-Premises' },
  { value: 'other', label: 'Other' },
];

const connectionStatusConfig = {
  disconnected: { icon: WifiOff, label: 'Not connected', color: 'text-muted-foreground', bg: 'bg-muted/50' },
  testing: { icon: Loader2, label: 'Testing...', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  connected: { icon: CheckCircle2, label: 'Connected', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  error: { icon: XCircle, label: 'Connection failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
};

export const Settings = () => {
  const { theme, toggleTheme, settings, updateSettings, clusters, addCluster, updateCluster, removeCluster, selectedCluster } = useDashboardStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  // Cluster form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clusterForm, setClusterForm] = useState(emptyCluster);
  const [showSecrets, setShowSecrets] = useState({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSliderChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleToggle = (key) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFormField = useCallback((field, value) => {
    setClusterForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleSecretVisibility = (field) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionTestResult(null);

    // Simulate a connection test (replace with real backend call)
    // In production: POST /api/clusters/test with the credentials
    await new Promise(resolve => setTimeout(resolve, 2000));

    const hasEndpoint = clusterForm.apiEndpoint.trim().startsWith('https://');
    const hasAuth =
      (clusterForm.authMethod === 'token' && clusterForm.bearerToken.trim()) ||
      (clusterForm.authMethod === 'certificate' && clusterForm.clientCertificate.trim() && clusterForm.clientKey.trim()) ||
      (clusterForm.authMethod === 'kubeconfig' && clusterForm.kubeconfig.trim());

    if (hasEndpoint && hasAuth) {
      setConnectionTestResult({ status: 'connected', message: 'Successfully connected to cluster API server' });
    } else {
      const missing = [];
      if (!hasEndpoint) missing.push('valid HTTPS API endpoint');
      if (!hasAuth) missing.push('authentication credentials');
      setConnectionTestResult({
        status: 'error',
        message: `Missing: ${missing.join(', ')}`,
      });
    }
    setTestingConnection(false);
  };

  const isFormValid = () => {
    if (!clusterForm.name.trim() || !clusterForm.apiEndpoint.trim()) return false;
    if (clusterForm.authMethod === 'token' && !clusterForm.bearerToken.trim()) return false;
    if (clusterForm.authMethod === 'certificate' && (!clusterForm.clientCertificate.trim() || !clusterForm.clientKey.trim())) return false;
    if (clusterForm.authMethod === 'kubeconfig' && !clusterForm.kubeconfig.trim()) return false;
    return true;
  };

  const handleAddCluster = () => {
    if (!isFormValid()) return;
    const id = clusterForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCluster({
      ...clusterForm,
      id,
      connectionStatus: connectionTestResult?.status === 'connected' ? 'connected' : 'disconnected',
    });
    setClusterForm(emptyCluster);
    setShowAddForm(false);
    setConnectionTestResult(null);
    setShowAdvanced(false);
  };

  const handleUpdateCluster = () => {
    if (!isFormValid()) return;
    updateCluster(editingId, {
      ...clusterForm,
      connectionStatus: connectionTestResult?.status === 'connected' ? 'connected' : clusterForm.connectionStatus,
    });
    setClusterForm(emptyCluster);
    setEditingId(null);
    setConnectionTestResult(null);
    setShowAdvanced(false);
  };

  const startEditing = (cluster) => {
    setEditingId(cluster.id);
    setClusterForm({
      name: cluster.name,
      environment: cluster.environment,
      provider: cluster.provider || '',
      apiEndpoint: cluster.apiEndpoint,
      k8sVersion: cluster.k8sVersion,
      authMethod: cluster.authMethod || 'token',
      bearerToken: cluster.bearerToken || '',
      clientCertificate: cluster.clientCertificate || '',
      clientKey: cluster.clientKey || '',
      caCertificate: cluster.caCertificate || '',
      kubeconfig: cluster.kubeconfig || '',
      skipTlsVerify: cluster.skipTlsVerify || false,
      connectionStatus: cluster.connectionStatus || 'disconnected',
    });
    setShowAddForm(false);
    setConnectionTestResult(null);
    setShowAdvanced(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setClusterForm(emptyCluster);
    setConnectionTestResult(null);
    setShowAdvanced(false);
    setShowSecrets({});
  };

  const handleFileUpload = (field) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = field === 'kubeconfig' ? '.yaml,.yml,.json,.conf' : '.pem,.crt,.key,.cert';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => updateFormField(field, ev.target.result);
      reader.readAsText(file);
    };
    input.click();
  };

  const envColors = {
    Production: 'bg-red-500/10 text-red-600 dark:text-red-400 border-0',
    Staging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0',
    Development: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0',
  };

  const providerLabels = Object.fromEntries(providers.map(p => [p.value, p.label]));

  const FieldWithTooltip = ({ label, tooltip, children }) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-xs">{label}</Label>
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px] text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  );

  const SecretField = ({ field, placeholder, multiline = false }) => {
    const visible = showSecrets[field];
    const Component = multiline ? Textarea : Input;
    return (
      <div className="relative">
        <Component
          placeholder={placeholder}
          value={clusterForm[field]}
          onChange={e => updateFormField(field, e.target.value)}
          className={`${multiline ? 'min-h-[80px] text-xs' : 'h-9 text-sm pr-16'} font-mono`}
          type={!multiline && !visible ? 'password' : 'text'}
        />
        <div className="absolute right-1 top-1 flex gap-0.5">
          {!multiline && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground"
              onClick={() => toggleSecretVisibility(field)}
            >
              {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
          )}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => handleFileUpload(field)}
          >
            <Upload className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  const ClusterFormFields = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      {/* Basic Info */}
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Cluster Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldWithTooltip label="Cluster Name" tooltip="A friendly name to identify this cluster in the dashboard">
            <Input
              placeholder="e.g. prod-us-east-1"
              value={clusterForm.name}
              onChange={e => updateFormField('name', e.target.value)}
              className="h-9 text-sm"
            />
          </FieldWithTooltip>
          <FieldWithTooltip label="Environment">
            <Select
              value={clusterForm.environment}
              onValueChange={v => updateFormField('environment', v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Staging">Staging</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
              </SelectContent>
            </Select>
          </FieldWithTooltip>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <FieldWithTooltip label="Cloud Provider" tooltip="Where the cluster is hosted (informational only)">
            <Select
              value={clusterForm.provider}
              onValueChange={v => updateFormField('provider', v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select provider..." />
              </SelectTrigger>
              <SelectContent>
                {providers.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWithTooltip>
          <FieldWithTooltip label="Kubernetes Version" tooltip="Will be auto-detected on connection if left empty">
            <Input
              placeholder="e.g. v1.28.5 (optional)"
              value={clusterForm.k8sVersion}
              onChange={e => updateFormField('k8sVersion', e.target.value)}
              className="h-9 text-sm font-mono"
            />
          </FieldWithTooltip>
        </div>
      </div>

      <Separator />

      {/* Connection */}
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Connection</p>
        <FieldWithTooltip
          label="API Server Endpoint"
          tooltip="The HTTPS URL of the Kubernetes API server. Find it with: kubectl cluster-info"
        >
          <Input
            placeholder="https://api.k8s.example.com:6443"
            value={clusterForm.apiEndpoint}
            onChange={e => updateFormField('apiEndpoint', e.target.value)}
            className="h-9 text-sm font-mono"
          />
        </FieldWithTooltip>
      </div>

      <Separator />

      {/* Authentication */}
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Authentication</p>
        <Tabs
          value={clusterForm.authMethod}
          onValueChange={v => updateFormField('authMethod', v)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="token" className="text-xs gap-1.5">
              <Key className="w-3 h-3" />
              Bearer Token
            </TabsTrigger>
            <TabsTrigger value="certificate" className="text-xs gap-1.5">
              <FileKey2 className="w-3 h-3" />
              Client Certificate
            </TabsTrigger>
            <TabsTrigger value="kubeconfig" className="text-xs gap-1.5">
              <FileText className="w-3 h-3" />
              Kubeconfig
            </TabsTrigger>
          </TabsList>

          <TabsContent value="token" className="space-y-3 mt-3">
            <FieldWithTooltip
              label="Bearer Token"
              tooltip="A Service Account token with read access. Create one with: kubectl create token <service-account>"
            >
              <SecretField field="bearerToken" placeholder="eyJhbGciOiJSUzI1NiIs..." />
            </FieldWithTooltip>
            <FieldWithTooltip
              label="CA Certificate"
              tooltip="The cluster's Certificate Authority cert. Optional if Skip TLS Verify is enabled."
            >
              <SecretField field="caCertificate" placeholder="-----BEGIN CERTIFICATE-----" multiline />
            </FieldWithTooltip>
          </TabsContent>

          <TabsContent value="certificate" className="space-y-3 mt-3">
            <FieldWithTooltip
              label="Client Certificate"
              tooltip="PEM-encoded client certificate for mutual TLS authentication"
            >
              <SecretField field="clientCertificate" placeholder="-----BEGIN CERTIFICATE-----" multiline />
            </FieldWithTooltip>
            <FieldWithTooltip
              label="Client Key"
              tooltip="PEM-encoded private key matching the client certificate"
            >
              <SecretField field="clientKey" placeholder="-----BEGIN RSA PRIVATE KEY-----" multiline />
            </FieldWithTooltip>
            <FieldWithTooltip
              label="CA Certificate"
              tooltip="The cluster's Certificate Authority cert. Optional if Skip TLS Verify is enabled."
            >
              <SecretField field="caCertificate" placeholder="-----BEGIN CERTIFICATE-----" multiline />
            </FieldWithTooltip>
          </TabsContent>

          <TabsContent value="kubeconfig" className="space-y-3 mt-3">
            <FieldWithTooltip
              label="Kubeconfig Contents"
              tooltip="Paste the full kubeconfig YAML. This contains the server, auth, and CA info all in one."
            >
              <div className="relative">
                <Textarea
                  placeholder={"apiVersion: v1\nkind: Config\nclusters:\n- cluster:\n    server: https://...\n  name: my-cluster\n..."}
                  value={clusterForm.kubeconfig}
                  onChange={e => updateFormField('kubeconfig', e.target.value)}
                  className="min-h-[120px] text-xs font-mono"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7 text-muted-foreground"
                  onClick={() => handleFileUpload('kubeconfig')}
                >
                  <Upload className="w-3.5 h-3.5" />
                </Button>
              </div>
            </FieldWithTooltip>
            <p className="text-[11px] text-muted-foreground">
              The API endpoint and CA certificate fields above will be overridden by values in the kubeconfig.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Advanced Options
        </button>
        {showAdvanced && (
          <div className="mt-3 p-3 rounded-lg border border-dashed space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Skip TLS Verification</Label>
                <p className="text-[10px] text-muted-foreground">
                  Not recommended for production. Only use for self-signed certificates.
                </p>
              </div>
              <Switch
                checked={clusterForm.skipTlsVerify}
                onCheckedChange={v => updateFormField('skipTlsVerify', v)}
              />
            </div>
            {clusterForm.skipTlsVerify && (
              <div className="flex items-start gap-2 p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <p className="text-[11px]">
                  Disabling TLS verification makes connections vulnerable to man-in-the-middle attacks. Provide a CA certificate instead when possible.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Test Connection & Submit */}
      <div className="space-y-3">
        {/* Connection test result */}
        {connectionTestResult && (
          <div className={`flex items-start gap-2 p-2.5 rounded-lg ${connectionStatusConfig[connectionTestResult.status]?.bg}`}>
            {connectionTestResult.status === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`text-xs font-medium ${connectionStatusConfig[connectionTestResult.status]?.color}`}>
                {connectionTestResult.status === 'connected' ? 'Connection Successful' : 'Connection Failed'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{connectionTestResult.message}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestConnection}
            disabled={!clusterForm.apiEndpoint.trim() || testingConnection}
            className="gap-1.5"
          >
            {testingConnection ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wifi className="w-3.5 h-3.5" />
            )}
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={!isFormValid()}
            className="gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            {submitLabel}
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit}>
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure clusters, alerts, notifications, and dashboard preferences
        </p>
      </div>

      {/* Cluster Management */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base">Clusters</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{clusters.length}</Badge>
            </div>
            {!showAddForm && !editingId && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={() => { setShowAddForm(true); setEditingId(null); setClusterForm(emptyCluster); }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Cluster
              </Button>
            )}
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Manage your Kubernetes cluster connections
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-3">
          {/* Add form */}
          {showAddForm && (
            <div className="p-3 sm:p-4 rounded-lg border bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground mb-3">New Cluster</p>
              <ClusterFormFields onSubmit={handleAddCluster} submitLabel="Add Cluster" />
            </div>
          )}

          {/* Cluster list */}
          <div className="divide-y rounded-lg border overflow-hidden">
            {clusters.map((cluster) => {
              const status = connectionStatusConfig[cluster.connectionStatus] || connectionStatusConfig.disconnected;
              const StatusIcon = status.icon;
              return (
                <div key={cluster.id}>
                  {editingId === cluster.id ? (
                    <div className="p-3 sm:p-4 bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-3">Edit Cluster</p>
                      <ClusterFormFields onSubmit={handleUpdateCluster} submitLabel="Save Changes" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${status.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium truncate">{cluster.name}</span>
                          <Badge className={`text-[10px] px-1.5 ${envColors[cluster.environment] || ''}`}>
                            {cluster.environment}
                          </Badge>
                          {cluster.provider && (
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              {providerLabels[cluster.provider] || cluster.provider}
                            </Badge>
                          )}
                          {cluster.id === selectedCluster && (
                            <Badge variant="secondary" className="text-[10px] px-1.5">Active</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                          {cluster.apiEndpoint}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {cluster.k8sVersion && (
                            <p className="text-[11px] text-muted-foreground">
                              Kubernetes {cluster.k8sVersion}
                            </p>
                          )}
                          <p className={`text-[11px] ${status.color}`}>
                            {status.label}
                          </p>
                          {cluster.authMethod && (
                            <p className="text-[11px] text-muted-foreground">
                              Auth: {cluster.authMethod === 'token' ? 'Token' : cluster.authMethod === 'certificate' ? 'Certificate' : 'Kubeconfig'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => startEditing(cluster)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeCluster(cluster.id)}
                          disabled={clusters.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Bell className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base">Alert Thresholds</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Set warning and critical thresholds for resource usage alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-5 sm:space-y-6">
          {[
            { id: 'cpu-warning', label: 'CPU Warning Threshold', key: 'cpuWarningThreshold', color: 'warning' },
            { id: 'cpu-critical', label: 'CPU Critical Threshold', key: 'cpuCriticalThreshold', color: 'critical' },
            { id: 'memory-warning', label: 'Memory Warning Threshold', key: 'memoryWarningThreshold', color: 'warning' },
            { id: 'memory-critical', label: 'Memory Critical Threshold', key: 'memoryCriticalThreshold', color: 'critical' },
          ].map(({ id, label, key, color }) => (
            <div key={id} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={id} className="text-xs sm:text-sm font-medium">{label}</Label>
                <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">{localSettings[key]}%</span>
              </div>
              <Slider
                id={id}
                min={50}
                max={100}
                step={1}
                value={[localSettings[key]]}
                onValueChange={(value) => handleSliderChange(key, value)}
                className={`[&_[role=slider]]:bg-status-${color} [&_[role=slider]]:border-status-${color}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Bell className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base">Notification Preferences</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Choose how you want to receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          {[
            { id: 'email', label: 'Email Notifications', desc: 'Receive alerts via email', key: 'emailNotifications' },
            { id: 'slack', label: 'Slack Notifications', desc: 'Send alerts to Slack channels', key: 'slackNotifications' },
            { id: 'webhook', label: 'Webhook Notifications', desc: 'POST alerts to custom webhook URL', key: 'webhookNotifications' },
          ].map(({ id, label, desc, key }, i) => (
            <div key={id}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <Label htmlFor={id} className="text-xs sm:text-sm font-medium">{label}</Label>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  id={id}
                  checked={localSettings[key]}
                  onCheckedChange={() => handleToggle(key)}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base">Dashboard Preferences</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Customize how the dashboard displays data
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="refresh" className="text-xs sm:text-sm font-medium">Refresh Interval</Label>
            <Select
              value={localSettings.refreshInterval.toString()}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, refreshInterval: parseInt(value) }))}
            >
              <SelectTrigger id="refresh" className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timerange" className="text-xs sm:text-sm font-medium">Default Chart Time Range</Label>
            <Select
              value={localSettings.defaultTimeRange}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, defaultTimeRange: value }))}
            >
              <SelectTrigger id="timerange" className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1 hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Palette className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base">Theme Settings</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 min-w-0">
              <Label htmlFor="darkmode" className="text-xs sm:text-sm font-medium">Dark Mode</Label>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Use dark theme for the dashboard</p>
            </div>
            <Switch
              id="darkmode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-4 sm:pb-0">
        <Button
          onClick={handleSave}
          size="lg"
          className={`w-full sm:w-auto ${saved ? 'bg-emerald-600 hover:bg-emerald-600/90' : ''}`}
        >
          <Save className="w-4 h-4 mr-2 flex-shrink-0" />
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
