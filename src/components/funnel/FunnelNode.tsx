import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { FunnelNodeData, NODE_TYPE_CONFIG } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FunnelNodeProps {
  data: FunnelNodeData;
  id: string;
}

const FunnelNode = memo(({ data, id }: FunnelNodeProps) => {
  const config = NODE_TYPE_CONFIG[data.nodeType];
  const isThankYou = data.nodeType === 'thankyou';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('deleteNode', { detail: { nodeId: id } }));
  };

  return (
    <div
      className={`
        relative bg-card rounded-lg border-2 shadow-node
        min-w-[180px] transition-all duration-200
        hover:shadow-lg group
        ${data.hasWarning ? 'border-destructive' : 'border-border'}
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-card"
      />

      {/* Warning Badge */}
      {data.hasWarning && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
              <AlertTriangle className="w-3 h-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{data.warningMessage}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -left-2 bg-card text-muted-foreground rounded-full p-1 border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* Node Header */}
      <div
        className="px-3 py-2 rounded-t-md border-b border-border"
        style={{
          backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
        }}
      >
        <div className="flex items-center gap-2">
          <config.Icon 
            className="w-4 h-4" 
            style={{ color: `hsl(var(--${config.color}))` }} 
          />
          <span className="font-medium text-sm text-foreground">{data.label}</span>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-2">Primary Action</div>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs pointer-events-none"
          style={{
            borderColor: `hsl(var(--${config.color}))`,
            color: `hsl(var(--${config.color}))`,
          }}
        >
          {data.buttonLabel}
        </Button>
      </div>

      {/* Output Handle - Not for Thank You pages */}
      {!isThankYou && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-primary !border-2 !border-card"
        />
      )}
    </div>
  );
});

FunnelNode.displayName = 'FunnelNode';

export default FunnelNode;
