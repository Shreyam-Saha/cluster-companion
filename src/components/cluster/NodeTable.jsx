import { Server, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const NodeTable = ({ nodes, onNodeSelect, selectedNode }) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Node</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Pods</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow
                key={node.id}
                onClick={() => onNodeSelect(node)}
                className={`cursor-pointer ${
                  selectedNode?.id === node.id ? 'bg-muted' : ''
                }`}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {node.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {node.ip}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {node.status === 'Ready' ? (
                      <CheckCircle className="w-4 h-4 text-status-healthy" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-status-warning" />
                    )}
                    <span className={`text-sm ${
                      node.status === 'Ready' ? 'text-status-healthy' : 'text-status-warning'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {node.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {node.cpu.usagePercent}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {node.cpu.used}/{node.cpu.capacity} cores
                    </div>
                    <Progress 
                      value={node.cpu.usagePercent} 
                      className={`h-1.5 ${
                        node.cpu.usagePercent >= 90
                          ? '[&>div]:bg-status-critical'
                          : node.cpu.usagePercent >= 70
                          ? '[&>div]:bg-status-warning'
                          : '[&>div]:bg-status-healthy'
                      }`}
                    />
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {node.memory.usagePercent}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {node.memory.used}/{node.memory.capacity} GB
                    </div>
                    <Progress 
                      value={node.memory.usagePercent}
                      className={`h-1.5 ${
                        node.memory.usagePercent >= 90
                          ? '[&>div]:bg-status-critical'
                          : node.memory.usagePercent >= 70
                          ? '[&>div]:bg-status-warning'
                          : '[&>div]:bg-status-healthy'
                      }`}
                    />
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm font-medium">
                    {node.pods.current}/{node.pods.capacity}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {format(node.createdAt, 'MMM dd, yyyy')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
