import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatusCard = ({ title, value, subtitle, status, trend, icon: Icon }) => {
  const statusConfig = {
    healthy: {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      ring: 'ring-emerald-500/20',
    },
    warning: {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      ring: 'ring-amber-500/20',
    },
    critical: {
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-500/10',
      ring: 'ring-red-500/20',
    },
  };

  const config = statusConfig[status] || statusConfig.healthy;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-[13px] font-medium text-muted-foreground truncate">
              {title}
            </p>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl sm:text-2xl font-semibold tracking-tight leading-none ${config.text}`}>
                {value}
              </h3>
              {trend && (
                <span className="text-muted-foreground flex-shrink-0">
                  {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                  {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                  {!['up', 'down'].includes(trend) && <Minus className="w-3.5 h-3.5" />}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-2 sm:p-2.5 rounded-lg ${config.bg} ring-1 ${config.ring} flex-shrink-0`}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.text}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
