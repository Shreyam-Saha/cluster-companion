import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Cluster } from './pages/Cluster';
import { Deployments } from './pages/Deployments';
import { Configurations } from './pages/Configurations';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cluster" element={<Cluster />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="configurations" element={<Configurations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
