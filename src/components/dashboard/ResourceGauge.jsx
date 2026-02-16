import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

export const ResourceGauge = ({ title, percentage, total, used, unit = 'GB' }) => {
  const getColor = () => {
    if (percentage >= 90) return 'hsl(0 84% 60%)'; // critical
    if (percentage >= 70) return 'hsl(38 92% 50%)'; // warning
    return 'hsl(158 64% 52%)'; // healthy
  };

  const data = [
    { name: 'Used', value: percentage },
    { name: 'Free', value: 100 - percentage },
  ];

  const color = getColor();

  return (
    <Card>
      <CardContent className="p-5">
        <div className="relative">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={50}
                outerRadius={65}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill={color} />
                <Cell fill="hsl(var(--border))" opacity={0.2} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
            <span className="text-2xl font-bold" style={{ color }}>
              {percentage}%
            </span>
          </div>
        </div>
        
        <div className="text-center mt-2 space-y-1">
          <p className="text-xs text-muted-foreground">
            {used} / {total} {unit}
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: color }}></span>
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
