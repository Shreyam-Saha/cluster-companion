import { useState, useEffect } from 'react';
import { Bell, Save, Server, Palette, Clock, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const emptyCluster = {
  name: '',
  environment: 'Production',
  apiEndpoint: '',
  k8sVersion: '',
};

export const Settings = () => {
  const { theme, toggleTheme, settings, updateSettings, clusters, addCluster, updateCluster, removeCluster, selectedCluster } = useDashboardStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  // Cluster form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clusterForm, setClusterForm] = useState(emptyCluster);

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

  const handleAddCluster = () => {
    if (!clusterForm.name.trim() || !clusterForm.apiEndpoint.trim()) return;
    const id = clusterForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCluster({ ...clusterForm, id });
    setClusterForm(emptyCluster);
    setShowAddForm(false);
  };

  const handleUpdateCluster = () => {
    if (!clusterForm.name.trim() || !clusterForm.apiEndpoint.trim()) return;
    updateCluster(editingId, clusterForm);
    setClusterForm(emptyCluster);
    setEditingId(null);
  };

  const startEditing = (cluster) => {
    setEditingId(cluster.id);
    setClusterForm({
      name: cluster.name,
      environment: cluster.environment,
      apiEndpoint: cluster.apiEndpoint,
      k8sVersion: cluster.k8sVersion,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setClusterForm(emptyCluster);
  };

  const envColors = {
    Production: 'bg-red-500/10 text-red-600 dark:text-red-400 border-0',
    Staging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0',
    Development: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0',
  };

  const ClusterFormFields = ({ onSubmit, submitLabel }) => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Cluster Name</Label>
          <Input
            placeholder="e.g. prod-us-east-1"
            value={clusterForm.name}
            onChange={e => setClusterForm(prev => ({ ...prev, name: e.target.value }))}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Environment</Label>
          <Select
            value={clusterForm.environment}
            onValueChange={v => setClusterForm(prev => ({ ...prev, environment: v }))}
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
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">API Server Endpoint</Label>
        <Input
          placeholder="https://api.k8s.example.com:6443"
          value={clusterForm.apiEndpoint}
          onChange={e => setClusterForm(prev => ({ ...prev, apiEndpoint: e.target.value }))}
          className="h-9 text-sm font-mono"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Kubernetes Version</Label>
        <Input
          placeholder="e.g. v1.28.5"
          value={clusterForm.k8sVersion}
          onChange={e => setClusterForm(prev => ({ ...prev, k8sVersion: e.target.value }))}
          className="h-9 text-sm font-mono"
        />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button size="sm" onClick={onSubmit} className="gap-1.5">
          <Check className="w-3.5 h-3.5" />
          {submitLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={cancelEdit}>
          <X className="w-3.5 h-3.5 mr-1" />
          Cancel
        </Button>
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
            {clusters.map((cluster) => (
              <div key={cluster.id}>
                {editingId === cluster.id ? (
                  <div className="p-3 sm:p-4 bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Edit Cluster</p>
                    <ClusterFormFields onSubmit={handleUpdateCluster} submitLabel="Save Changes" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{cluster.name}</span>
                        <Badge className={`text-[10px] px-1.5 ${envColors[cluster.environment] || ''}`}>
                          {cluster.environment}
                        </Badge>
                        {cluster.id === selectedCluster && (
                          <Badge variant="secondary" className="text-[10px] px-1.5">Active</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                        {cluster.apiEndpoint}
                      </p>
                      {cluster.k8sVersion && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Kubernetes {cluster.k8sVersion}
                        </p>
                      )}
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
            ))}
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
