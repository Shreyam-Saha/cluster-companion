import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const ResourceGauge = ({ title, percentage, total, used, unit = 'GB' }) => {
  const getConfig = () => {
    if (percentage >= 90) return { text: 'text-red-600 dark:text-red-400', indicator: 'bg-red-500', dot: 'bg-red-500', trackBg: 'bg-red-500/20' };
    if (percentage >= 70) return { text: 'text-amber-600 dark:text-amber-400', indicator: 'bg-amber-500', dot: 'bg-amber-500', trackBg: 'bg-amber-500/20' };
    return { text: 'text-emerald-600 dark:text-emerald-400', indicator: 'bg-emerald-500', dot: 'bg-emerald-500', trackBg: 'bg-emerald-500/20' };
  };

  const config = getConfig();

  return (
    <Card className="shadow-card">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} />
            <span className="text-sm font-medium truncate">{title}</span>
          </div>
          <span className={`text-base sm:text-lg font-semibold tabular-nums ${config.text} flex-shrink-0 ml-2`}>
            {percentage}%
          </span>
        </div>

        <Progress
          value={percentage}
          className={`h-2 ${config.trackBg}`}
          indicatorClassName={config.indicator}
        />

        <div className="flex items-center justify-between mt-2.5 sm:mt-3">
          <span className="text-[11px] sm:text-xs text-muted-foreground tabular-nums">
            {used} {unit} used
          </span>
          <span className="text-[11px] sm:text-xs text-muted-foreground tabular-nums">
            {total} {unit} total
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
