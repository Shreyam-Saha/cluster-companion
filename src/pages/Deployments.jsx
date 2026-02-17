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
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Deployments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Microservices status, pod health, and rollout history
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4 md:pt-6 md:px-6 md:pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search deployments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Namespace Filter */}
              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
                <Select value={namespaceFilter} onValueChange={setNamespaceFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
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
              <div className="flex items-center bg-muted rounded-lg p-0.5 flex-shrink-0">
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
          </div>
        </CardContent>
      </Card>

      {/* Deployments Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
        <Card className="shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[650px]">
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
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {deployment.namespace}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={deployment.status === 'Healthy' ? 'default' : 'destructive'}
                        className={`text-[10px] border-0 ${
                          deployment.status === 'Healthy'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {deployment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {deployment.replicas.ready}/{deployment.replicas.desired}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground truncate block max-w-[200px]">
                        {deployment.image}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <CardHeader className="border-b px-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-2xl truncate">
                      {selectedDeployment.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      {selectedDeployment.namespace}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDeployment(null)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className="max-h-[calc(90vh-100px)]">
                <CardContent className="p-4 sm:pt-6 sm:px-6 space-y-5 sm:space-y-6">
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5">Status</div>
                      <div className={`font-medium ${
                        selectedDeployment.status === 'Healthy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {selectedDeployment.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5">Replicas</div>
                      <div className="tabular-nums">
                        {selectedDeployment.replicas.ready}/{selectedDeployment.replicas.desired}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5">Strategy</div>
                      <div>{selectedDeployment.strategy}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-0.5">Revisions</div>
                      <div className="tabular-nums">{selectedDeployment.revisions}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Image */}
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1.5">Image</div>
                    <div className="text-xs sm:text-sm font-mono bg-muted p-2.5 rounded overflow-x-auto">
                      {selectedDeployment.image}
                    </div>
                  </div>

                  <Separator />

                  {/* Health Checks */}
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2">Health Checks</div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selectedDeployment.livenessProbe ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">Liveness Probe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selectedDeployment.readinessProbe ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">Readiness Probe</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pods */}
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2">Pods</div>
                    <div className="space-y-2">
                      {getDeploymentPods(selectedDeployment.name).map(pod => (
                        <div key={pod.id} className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-lg bg-muted">
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">
                              {pod.name}
                            </div>
                            <div className="text-[11px] sm:text-xs text-muted-foreground">
                              Node: {pod.node} &middot; Restarts: {pod.restarts}
                            </div>
                          </div>
                          <Badge
                            variant={pod.status === 'Running' ? 'default' : 'destructive'}
                            className={`text-[10px] flex-shrink-0 border-0 ${
                              pod.status === 'Running'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
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
