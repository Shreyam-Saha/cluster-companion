import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

export const ResourceCharts = ({ data }) => {
  // Mock namespace data for bar chart
  const namespaceData = [
    { name: 'production', cpu: 75, memory: 85 },
    { name: 'default', cpu: 20, memory: 35 },
    { name: 'infrastructure', cpu: 45, memory: 55 },
    { name: 'monitoring', cpu: 30, memory: 40 },
    { name: 'kube-system', cpu: 55, memory: 65 },
  ];

  return (
    <div className="space-y-6">
      {/* CPU & Memory + Network I/O Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-text-dark light:text-text-light">
            CPU & Memory Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpuCluster" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMemoryCluster" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="dark:text-border-dark light:text-border-light opacity-20" />
              <XAxis
                dataKey="timestamp"
                stroke="currentColor"
                className="dark:text-text-dark-secondary light:text-text-light-secondary"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                stroke="currentColor"
                className="dark:text-text-dark-secondary light:text-text-light-secondary"
                style={{ fontSize: '11px' }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-dark)',
                  border: '1px solid var(--color-border-dark)',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCpuCluster)"
                name="CPU %"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorMemoryCluster)"
                name="Memory %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Network I/O */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-text-dark light:text-text-light">
            Network I/O (MB/s)
          </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorNetIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNetOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="dark:text-border-dark light:text-border-light opacity-20" />
            <XAxis
              dataKey="timestamp"
              stroke="currentColor"
              className="dark:text-text-dark-secondary light:text-text-light-secondary"
              style={{ fontSize: '11px' }}
            />
            <YAxis
              stroke="currentColor"
              className="dark:text-text-dark-secondary light:text-text-light-secondary"
              style={{ fontSize: '11px' }}
              unit=" MB/s"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: '8px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="networkIn"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorNetIn)"
              name="Network In"
            />
            <Area
              type="monotone"
              dataKey="networkOut"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorNetOut)"
              name="Network Out"
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Namespace Resource Usage */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-text-dark light:text-text-light">
          Namespace Resource Usage
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={namespaceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="dark:text-border-dark light:text-border-light opacity-20" />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              className="dark:text-text-dark-secondary light:text-text-light-secondary"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="currentColor"
              className="dark:text-text-dark-secondary light:text-text-light-secondary"
              style={{ fontSize: '12px' }}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="cpu" fill="#3b82f6" name="CPU %" />
            <Bar dataKey="memory" fill="#10b981" name="Memory %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
