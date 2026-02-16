import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatusCard = ({ title, value, subtitle, status, trend, icon: Icon }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-status-healthy';
      case 'warning':
        return 'text-status-warning';
      case 'critical':
        return 'text-status-critical';
      default:
        return 'text-foreground';
    }
  };

  const getBackgroundClass = () => {
    switch (status) {
      case 'warning':
        return 'bg-status-warning bg-opacity-10';
      case 'healthy':
        return 'bg-status-healthy bg-opacity-10';
      case 'critical':
        return 'bg-status-critical bg-opacity-10';
      default:
        return 'bg-muted';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-2.5 rounded-lg ${getBackgroundClass()} flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${getStatusColor()}`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className={`text-2xl font-bold ${getStatusColor()}`}>
                {value}
              </h3>
              {trend && (
                <span className="flex items-center text-sm text-muted-foreground">
                  {getTrendIcon()}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
