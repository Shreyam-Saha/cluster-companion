# Cluster Companion

A modern, enterprise-grade Kubernetes cluster monitoring dashboard built with React, Vite, and shadcn/ui.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-black)

## Features

- **Cluster Overview** - Real-time node status, pod health, and resource utilization at a glance
- **Multi-cluster Support** - Switch between production, staging, and development clusters
- **Resource Analytics** - CPU, memory, and disk usage with 24h trend charts
- **Alert Management** - Active alerts with severity classification and acknowledgement
- **Deployment Management** - Grid/list views, search, namespace filtering, and deployment details
- **Configuration Viewer** - Browse ConfigMaps, Secrets, Ingress rules, and Services with YAML syntax highlighting
- **Dark/Light Mode** - Seamless theme switching with persistent preference
- **Fully Responsive** - Mobile-first design that works on all screen sizes

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build Tool | Vite |
| Routing | React Router v7 |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State | Zustand (with persistence) |
| Charts | Recharts |
| Mock Data | @faker-js/faker |
| Dates | date-fns |
| Syntax Highlighting | react-syntax-highlighter |

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── dashboard/          # StatusCard, ResourceGauge, AlertPanel, EventFeed
│   ├── cluster/            # NodeTable, NodeDetailPanel, ResourceCharts
│   ├── deployments/        # DeploymentCard
│   ├── configurations/     # YamlViewer
│   └── layout/             # Sidebar, Header, Layout
├── pages/
│   ├── Home.jsx            # Overview dashboard
│   ├── Cluster.jsx         # Node health & resource trends
│   ├── Deployments.jsx     # Deployment management
│   ├── Configurations.jsx  # ConfigMaps, Secrets, Ingress, Services
│   └── Settings.jsx        # Alerts, notifications, preferences
├── hooks/
│   └── useMockData.js      # Mock data hook
├── services/
│   └── mockDataGenerator.js
├── store/
│   └── dashboardStore.js   # Zustand store
├── lib/
│   └── utils.js            # cn() utility
├── App.jsx
├── main.jsx
└── index.css               # Theme variables & global styles
```

## Pages

**Home** - Status cards, resource gauges, quick stats, 24h trend chart, alerts, and activity feed.

**Cluster** - Node table with CPU/memory progress bars, resource trend charts, namespace usage bar chart, and filterable events log. Click a node to open the detail panel.

**Deployments** - Toggle between grid and list views. Search by name, filter by namespace. Click a deployment for full details including pod status and health checks.

**Configurations** - Tables for ConfigMaps, Secrets, Ingress Rules, and Services. Click "YAML" to view syntax-highlighted configuration.

**Settings** - Alert thresholds (CPU/memory warning & critical), notification preferences (email, Slack, webhook), refresh interval, time range, and theme toggle.

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| < 640px | Single column, mobile menu in header, collapsible search, full-width modals |
| 640-1024px | 2-column grids, side panels, visible search bar |
| > 1024px | Full multi-column layouts, icon-only sidebar, max-width content area |

## Customization

### Theme Colors

Edit CSS variables in `src/index.css` under `:root` (light) and `.dark` (dark) selectors. Colors use HSL format for the shadcn/ui system.

### Mock Data

Edit `src/services/mockDataGenerator.js` to adjust node counts, resource ranges, alert frequency, etc.

### Adding Components

```bash
npx shadcn@latest add <component-name>
```

## License

MIT
