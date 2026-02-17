import { useState, useEffect } from 'react';
import { Bell, Save, Server, Palette, Clock } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const Settings = () => {
  const { theme, toggleTheme, settings, updateSettings } = useDashboardStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSliderChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleToggle = (key) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure alerts, notifications, and dashboard preferences
        </p>
      </div>

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
                <Label htmlFor={id} className="text-xs sm:text-sm font-medium">
                  {label}
                </Label>
                <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
                  {localSettings[key]}%
                </span>
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
            <Label htmlFor="refresh" className="text-xs sm:text-sm font-medium">
              Refresh Interval
            </Label>
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
            <Label htmlFor="timerange" className="text-xs sm:text-sm font-medium">
              Default Chart Time Range
            </Label>
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

      {/* Cluster Connection Info */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Server className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base">Cluster Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <dl className="space-y-3">
            <div>
              <dt className="text-xs sm:text-sm text-muted-foreground">API Server Endpoint</dt>
              <dd className="text-xs sm:text-sm font-mono mt-1 break-all">https://api.k8s.production.example.com:6443</dd>
            </div>
            <Separator />
            <div>
              <dt className="text-xs sm:text-sm text-muted-foreground">Kubernetes Version</dt>
              <dd className="text-xs sm:text-sm mt-1">v1.28.5</dd>
            </div>
            <Separator />
            <div>
              <dt className="text-xs sm:text-sm text-muted-foreground">Cluster Name</dt>
              <dd className="text-xs sm:text-sm mt-1">production-us-east-1</dd>
            </div>
          </dl>
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
