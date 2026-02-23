import { Clock } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIME_RANGES = [
  { value: '1h', label: 'Last 1 Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '12h', label: 'Last 12 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
];

export const TimeRangeSelector = ({ className = '' }) => {
  const timeRange = useDashboardStore((s) => s.timeRange);
  const setTimeRange = useDashboardStore((s) => s.setTimeRange);

  return (
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger className={`w-[160px] h-8 text-xs border-0 bg-secondary/50 ${className}`}>
        <Clock className="w-3 h-3 mr-1.5 flex-shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIME_RANGES.map(({ value, label }) => (
          <SelectItem key={value} value={value} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const TIME_RANGE_LABELS = {
  '1h': 'Last 1h',
  '6h': 'Last 6h',
  '12h': 'Last 12h',
  '24h': 'Last 24h',
};
