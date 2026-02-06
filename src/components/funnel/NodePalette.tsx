import { NodeType, NODE_TYPE_CONFIG } from '@/types/funnel';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const NodePalette = ({ onDragStart }: NodePaletteProps) => {
  const nodeTypes: NodeType[] = ['sales', 'order', 'upsell', 'downsell', 'thankyou'];

  return (
    <div className="w-60 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground text-sm">Page Types</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag and drop to canvas
        </p>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-auto">
        {nodeTypes.map((type) => {
          const config = NODE_TYPE_CONFIG[type];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className="
                flex items-center gap-3 p-3 rounded-lg border border-border
                bg-card cursor-grab active:cursor-grabbing
                hover:border-primary hover:shadow-sm
                transition-all duration-200
              "
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
                }}
              >
                <config.Icon 
                  className="w-5 h-5" 
                  style={{ color: `hsl(var(--${config.color}))` }} 
                />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">
                  {config.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {type === 'thankyou' ? 'End point' : 'Connectable'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodePalette;
