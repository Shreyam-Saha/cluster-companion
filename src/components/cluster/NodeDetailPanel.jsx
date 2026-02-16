import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMockData } from '../../hooks/useMockData';

export const NodeDetailPanel = ({ node, onClose }) => {
  const { timeSeriesData } = useMockData();

  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] z-50 shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col dark:bg-surface-dark light:bg-surface-light">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-border-dark light:border-border-light">
          <div>
            <h2 className="text-xl font-semibold dark:text-text-dark light:text-text-light">
              {node.name}
            </h2>
            <p className="text-sm dark:text-text-dark-secondary light:text-text-light-secondary">
              {node.ip}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:dark:bg-surface-dark-hover hover:light:bg-surface-light-hover"
          >
            <X className="w-5 h-5 dark:text-text-dark light:text-text-light" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Node Info */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3 dark:text-text-dark light:text-text-light">
              Node Information
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="dark:text-text-dark-secondary light:text-text-light-secondary">Status</dt>
                <dd className={`font-medium ${
                  node.status === 'Ready' ? 'text-status-healthy' : 'text-status-warning'
                }`}>
                  {node.status}
                </dd>
              </div>
              <div>
                <dt className="dark:text-text-dark-secondary light:text-text-light-secondary">OS</dt>
                <dd className="dark:text-text-dark light:text-text-light">{node.os}</dd>
              </div>
              <div>
                <dt className="dark:text-text-dark-secondary light:text-text-light-secondary">Kernel</dt>
                <dd className="dark:text-text-dark light:text-text-light">{node.kernel}</dd>
              </div>
              <div>
                <dt className="dark:text-text-dark-secondary light:text-text-light-secondary">Container Runtime</dt>
                <dd className="dark:text-text-dark light:text-text-light">{node.containerRuntime}</dd>
              </div>
              <div>
                <dt className="dark:text-text-dark-secondary light:text-text-light-secondary">Kubelet Version</dt>
                <dd className="dark:text-text-dark light:text-text-light">{node.kubeletVersion}</dd>
              </div>
              <div>
                <dt className="dark:text-text-dark-secondary light:text-text-light-secondary">Pods</dt>
                <dd className="dark:text-text-dark light:text-text-light">
                  {node.pods.current}/{node.pods.capacity}
                </dd>
              </div>
            </dl>
          </div>

          {/* CPU Chart */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3 dark:text-text-dark light:text-text-light">
              CPU Usage (Last 24 Hours)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="dark:text-border-dark light:text-border-light opacity-20" />
                <XAxis
                  dataKey="timestamp"
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
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#5794f2"
                  strokeWidth={2}
                  dot={false}
                  name="CPU %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Memory Chart */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3 dark:text-text-dark light:text-text-light">
              Memory Usage (Last 24 Hours)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="dark:text-border-dark light:text-border-light opacity-20" />
                <XAxis
                  dataKey="timestamp"
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
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#b877d9"
                  strokeWidth={2}
                  dot={false}
                  name="Memory %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Disk I/O Chart */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3 dark:text-text-dark light:text-text-light">
              Disk Usage (Last 24 Hours)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="dark:text-border-dark light:text-border-light opacity-20" />
                <XAxis
                  dataKey="timestamp"
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
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="disk"
                  stroke="#73bf69"
                  strokeWidth={2}
                  dot={false}
                  name="Disk %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
