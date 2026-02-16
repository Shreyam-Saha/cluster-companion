import { useState } from 'react';
import { Search, Filter, Grid, List, Box, X } from 'lucide-react';
import { DeploymentCard } from '../components/deployments/DeploymentCard';
import { useMockData } from '../hooks/useMockData';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export const Deployments = () => {
  const { deployments, pods } = useMockData();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [selectedDeployment, setSelectedDeployment] = useState(null);

  const filteredDeployments = deployments.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNamespace = namespaceFilter === 'all' || d.namespace === namespaceFilter;
    return matchesSearch && matchesNamespace;
  });

  const namespaces = ['all', ...new Set(deployments.map(d => d.namespace))];

  const getDeploymentPods = (deploymentName) => {
    return pods.filter(p => p.deployment === deploymentName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Box className="w-6 h-6 mr-2" />
          Deployments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Microservices status, pod health, and rollout history
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search deployments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Namespace Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={namespaceFilter} onValueChange={setNamespaceFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {namespaces.map(ns => (
                    <SelectItem key={ns} value={ns}>
                      {ns === 'all' ? 'All Namespaces' : ns}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployments Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeployments.map(deployment => (
            <DeploymentCard
              key={deployment.id}
              deployment={deployment}
              pods={getDeploymentPods(deployment.name)}
              onClick={() => setSelectedDeployment(deployment)}
            />
          ))}
        </div>
      ) : (
        /* Deployments Table */
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Replicas</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeployments.map(deployment => (
                  <TableRow
                    key={deployment.id}
                    onClick={() => setSelectedDeployment(deployment)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {deployment.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {deployment.namespace}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={deployment.status === 'Healthy' ? 'default' : 'destructive'}
                        className={`text-xs ${
                          deployment.status === 'Healthy'
                            ? 'bg-status-healthy/10 text-status-healthy hover:bg-status-healthy/20'
                            : 'bg-status-warning/10 text-status-warning hover:bg-status-warning/20'
                        }`}
                      >
                        {deployment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {deployment.replicas.ready}/{deployment.replicas.desired}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {deployment.image}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(deployment.lastUpdated, 'MMM dd, yyyy')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Deployment Detail Modal */}
      {selectedDeployment && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setSelectedDeployment(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedDeployment.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDeployment.namespace}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDeployment(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className="max-h-[calc(90vh-100px)]">
                <CardContent className="pt-6 space-y-6">
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className={`font-medium ${
                        selectedDeployment.status === 'Healthy' ? 'text-status-healthy' : 'text-status-warning'
                      }`}>
                        {selectedDeployment.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Replicas</div>
                      <div>
                        {selectedDeployment.replicas.ready}/{selectedDeployment.replicas.desired}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Strategy</div>
                      <div>
                        {selectedDeployment.strategy}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Revisions</div>
                      <div>
                        {selectedDeployment.revisions}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Image */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Image</div>
                    <div className="text-sm font-mono bg-muted p-2 rounded">
                      {selectedDeployment.image}
                    </div>
                  </div>

                  <Separator />

                  {/* Health Checks */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Health Checks</div>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedDeployment.livenessProbe ? 'bg-status-healthy' : 'bg-status-critical'
                        }`} />
                        <span className="text-sm">
                          Liveness Probe
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedDeployment.readinessProbe ? 'bg-status-healthy' : 'bg-status-critical'
                        }`} />
                        <span className="text-sm">
                          Readiness Probe
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pods */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Pods</div>
                    <div className="space-y-2">
                      {getDeploymentPods(selectedDeployment.name).map(pod => (
                        <div key={pod.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                          <div>
                            <div className="text-sm font-medium">
                              {pod.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Node: {pod.node} • Restarts: {pod.restarts}
                            </div>
                          </div>
                          <Badge
                            variant={pod.status === 'Running' ? 'default' : 'destructive'}
                            className={`text-xs ${
                              pod.status === 'Running'
                                ? 'bg-status-healthy/10 text-status-healthy hover:bg-status-healthy/20'
                                : 'bg-status-critical/10 text-status-critical hover:bg-status-critical/20'
                            }`}
                          >
                            {pod.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
