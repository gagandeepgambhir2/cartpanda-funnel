import { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import FunnelNode from './FunnelNode';
import NodePalette from './NodePalette';
import FunnelHeader from './FunnelHeader';
import ValidationPanel from './ValidationPanel';
import { useFunnelState } from '@/hooks/useFunnelState';
import { FunnelNodeData, NodeType } from '@/types/funnel';

type FunnelNodeType = Node<FunnelNodeData>;

const FunnelCanvasInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const nodeTypes = useMemo(() => ({
    funnelNode: FunnelNode,
  }), []);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    deleteSelected,
    clearCanvas,
    exportJSON,
    importJSON,
    getValidationWarnings,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useFunnelState();

  // Handle node deletion via custom event
  useEffect(() => {
    const handleDeleteNode = (e: CustomEvent<{ nodeId: string }>) => {
      deleteNode(e.detail.nodeId);
    };
    window.addEventListener('deleteNode', handleDeleteNode as EventListener);
    return () => {
      window.removeEventListener('deleteNode', handleDeleteNode as EventListener);
    };
  }, [deleteNode]);

  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!nodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(nodeType, position);
    },
    [screenToFlowPosition, addNode]
  );

  const warnings = getValidationWarnings();

  return (
    <div className="h-screen flex flex-col bg-background">
      <FunnelHeader
        onExport={exportJSON}
        onImport={importJSON}
        onClear={clearCanvas}
        onUndo={undo}
        onRedo={redo}
        onDeleteSelected={deleteSelected}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="flex-1 flex overflow-hidden">
        <NodePalette onDragStart={onDragStart} />

        <div ref={reactFlowWrapper} className="flex-1 relative">
          <ReactFlow<FunnelNodeType>
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
            }}
            className="bg-canvas-bg"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              className="!bg-canvas-bg"
              color="hsl(var(--canvas-grid))"
            />
            <Controls className="!bg-card !border-border !shadow-md" />
            <MiniMap
              className="!bg-card !border-border"
              nodeColor={(node) => {
                const nodeData = node.data as FunnelNodeData;
                const nodeType = nodeData?.nodeType as NodeType;
                const colorMap: Record<NodeType, string> = {
                  sales: 'hsl(217 91% 60%)',
                  order: 'hsl(142 76% 36%)',
                  upsell: 'hsl(271 91% 65%)',
                  downsell: 'hsl(25 95% 53%)',
                  thankyou: 'hsl(173 80% 40%)',
                };
                return colorMap[nodeType] || 'hsl(var(--muted))';
              }}
            />
          </ReactFlow>

          {nodes.length > 0 && <ValidationPanel warnings={warnings} />}
        </div>
      </div>
    </div>
  );
};

const FunnelCanvas = () => {
  return (
    <ReactFlowProvider>
      <FunnelCanvasInner />
    </ReactFlowProvider>
  );
};

export default FunnelCanvas;
