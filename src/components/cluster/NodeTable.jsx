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
    <Card className="overflow-hidden shadow-card">
      <div className="overflow-x-auto -mx-px">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Node</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Roles</TableHead>
              <TableHead className="w-[140px]">CPU</TableHead>
              <TableHead className="w-[140px]">Memory</TableHead>
              <TableHead className="w-[80px]">Pods</TableHead>
              <TableHead className="w-[110px]">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow
                key={node.id}
                onClick={() => onNodeSelect(node)}
                className={`cursor-pointer transition-colors ${
                  selectedNode?.id === node.id ? 'bg-muted' : ''
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">
                        {node.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono truncate">
                        {node.ip}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {node.status === 'Ready' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      node.status === 'Ready' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {node.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-[10px] px-1.5">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium tabular-nums">
                        {node.cpu.usagePercent}%
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {node.cpu.used}/{node.cpu.capacity}
                      </span>
                    </div>
                    <Progress 
                      value={node.cpu.usagePercent} 
                      className={`h-1.5 ${
                        node.cpu.usagePercent >= 90
                          ? '[&>div]:bg-red-500'
                          : node.cpu.usagePercent >= 70
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-emerald-500'
                      }`}
                    />
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium tabular-nums">
                        {node.memory.usagePercent}%
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {node.memory.used}/{node.memory.capacity} GB
                      </span>
                    </div>
                    <Progress 
                      value={node.memory.usagePercent}
                      className={`h-1.5 ${
                        node.memory.usagePercent >= 90
                          ? '[&>div]:bg-red-500'
                          : node.memory.usagePercent >= 70
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-emerald-500'
                      }`}
                    />
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm font-medium tabular-nums">
                    {node.pods.current}/{node.pods.capacity}
                  </span>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(node.createdAt, 'MMM dd, yyyy')}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
