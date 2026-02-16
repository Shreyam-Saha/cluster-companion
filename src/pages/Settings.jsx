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
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold">
          Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure alerts, notifications, and dashboard preferences
        </p>
      </div>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Alert Thresholds</CardTitle>
          </div>
          <CardDescription>
            Set warning and critical thresholds for resource usage alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CPU Warning */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cpu-warning" className="text-sm font-medium">
                CPU Warning Threshold
              </Label>
              <span className="text-sm text-muted-foreground">
                {localSettings.cpuWarningThreshold}%
              </span>
            </div>
            <Slider
              id="cpu-warning"
              min={50}
              max={100}
              step={1}
              value={[localSettings.cpuWarningThreshold]}
              onValueChange={(value) => handleSliderChange('cpuWarningThreshold', value)}
              className="[&_[role=slider]]:bg-status-warning [&_[role=slider]]:border-status-warning"
            />
          </div>

          {/* CPU Critical */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cpu-critical" className="text-sm font-medium">
                CPU Critical Threshold
              </Label>
              <span className="text-sm text-muted-foreground">
                {localSettings.cpuCriticalThreshold}%
              </span>
            </div>
            <Slider
              id="cpu-critical"
              min={50}
              max={100}
              step={1}
              value={[localSettings.cpuCriticalThreshold]}
              onValueChange={(value) => handleSliderChange('cpuCriticalThreshold', value)}
              className="[&_[role=slider]]:bg-status-critical [&_[role=slider]]:border-status-critical"
            />
          </div>

          {/* Memory Warning */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="memory-warning" className="text-sm font-medium">
                Memory Warning Threshold
              </Label>
              <span className="text-sm text-muted-foreground">
                {localSettings.memoryWarningThreshold}%
              </span>
            </div>
            <Slider
              id="memory-warning"
              min={50}
              max={100}
              step={1}
              value={[localSettings.memoryWarningThreshold]}
              onValueChange={(value) => handleSliderChange('memoryWarningThreshold', value)}
              className="[&_[role=slider]]:bg-status-warning [&_[role=slider]]:border-status-warning"
            />
          </div>

          {/* Memory Critical */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="memory-critical" className="text-sm font-medium">
                Memory Critical Threshold
              </Label>
              <span className="text-sm text-muted-foreground">
                {localSettings.memoryCriticalThreshold}%
              </span>
            </div>
            <Slider
              id="memory-critical"
              min={50}
              max={100}
              step={1}
              value={[localSettings.memoryCriticalThreshold]}
              onValueChange={(value) => handleSliderChange('memoryCriticalThreshold', value)}
              className="[&_[role=slider]]:bg-status-critical [&_[role=slider]]:border-status-critical"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email" className="text-sm font-medium">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch
              id="email"
              checked={localSettings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <Separator />

          {/* Slack */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="slack" className="text-sm font-medium">Slack Notifications</Label>
              <p className="text-xs text-muted-foreground">Send alerts to Slack channels</p>
            </div>
            <Switch
              id="slack"
              checked={localSettings.slackNotifications}
              onCheckedChange={() => handleToggle('slackNotifications')}
            />
          </div>

          <Separator />

          {/* Webhook */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="webhook" className="text-sm font-medium">Webhook Notifications</Label>
              <p className="text-xs text-muted-foreground">POST alerts to custom webhook URL</p>
            </div>
            <Switch
              id="webhook"
              checked={localSettings.webhookNotifications}
              onCheckedChange={() => handleToggle('webhookNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <CardTitle>Dashboard Preferences</CardTitle>
          </div>
          <CardDescription>
            Customize how the dashboard displays data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Refresh Interval */}
          <div className="space-y-2">
            <Label htmlFor="refresh" className="text-sm font-medium">
              Refresh Interval
            </Label>
            <Select
              value={localSettings.refreshInterval.toString()}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, refreshInterval: parseInt(value) }))}
            >
              <SelectTrigger id="refresh">
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

          {/* Default Time Range */}
          <div className="space-y-2">
            <Label htmlFor="timerange" className="text-sm font-medium">
              Default Chart Time Range
            </Label>
            <Select
              value={localSettings.defaultTimeRange}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, defaultTimeRange: value }))}
            >
              <SelectTrigger id="timerange">
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
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <CardTitle>Theme Settings</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkmode" className="text-sm font-medium">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Use dark theme for the dashboard</p>
            </div>
            <Switch
              id="darkmode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cluster Connection Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <CardTitle>Cluster Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">API Server Endpoint</dt>
              <dd className="text-sm font-mono mt-1">https://api.k8s.production.example.com:6443</dd>
            </div>
            <Separator />
            <div>
              <dt className="text-sm text-muted-foreground">Kubernetes Version</dt>
              <dd className="text-sm mt-1">v1.28.5</dd>
            </div>
            <Separator />
            <div>
              <dt className="text-sm text-muted-foreground">Cluster Name</dt>
              <dd className="text-sm mt-1">production-us-east-1</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          className={saved ? 'bg-status-healthy hover:bg-status-healthy/90' : ''}
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
