import { useCallback, useEffect, useState, useRef } from 'react';
import {
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
} from '@xyflow/react';
import { FunnelNodeData, FunnelState, NodeType, NODE_TYPE_CONFIG } from '@/types/funnel';

const STORAGE_KEY = 'funnel-builder-state';
const MAX_HISTORY = 50;

type FunnelNode = Node<FunnelNodeData>;

interface HistoryState {
  nodes: FunnelNode[];
  edges: Edge[];
  counters: { upsell: number; downsell: number };
}

const getInitialState = (): FunnelState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load saved state:', e);
  }
  return {
    nodes: [],
    edges: [],
    counters: { upsell: 0, downsell: 0 },
  };
};

export const useFunnelState = () => {
  const [nodes, setNodes] = useState<FunnelNode[]>(() => getInitialState().nodes);
  const [edges, setEdges] = useState<Edge[]>(() => getInitialState().edges);
  const [counters, setCounters] = useState(() => getInitialState().counters);
  
  // Undo/Redo history
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    
    const currentState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      counters: { ...counters },
    };
    
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [nodes, edges, counters, historyIndex]);

  // Undo action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setCounters(prevState.counters);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex]);

  // Redo action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCounters(nextState.counters);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Initialize history with initial state
  useEffect(() => {
    if (history.length === 0) {
      const initialState: HistoryState = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        counters: { ...counters },
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const state: FunnelState = { nodes, edges, counters };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [nodes, edges, counters]);

  const onNodesChange: OnNodesChange<FunnelNode> = useCallback(
    (changes) => {
      const hasSignificantChange = changes.some(
        (c) => c.type === 'remove' || c.type === 'add'
      );
      if (hasSignificantChange) {
        saveToHistory();
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [saveToHistory]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const hasSignificantChange = changes.some(
        (c) => c.type === 'remove' || c.type === 'add'
      );
      if (hasSignificantChange) {
        saveToHistory();
      }
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [saveToHistory]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      // Check if source node is a Thank You page
      const sourceNode = nodes.find((n) => n.id === connection.source);
      if (sourceNode?.data.nodeType === 'thankyou') {
        return; // Don't allow connections from Thank You pages
      }
      saveToHistory();
      setEdges((eds) => addEdge({ ...connection, type: 'smoothstep', animated: true }, eds));
    },
    [nodes, saveToHistory]
  );

  const addNode = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      saveToHistory();
      const config = NODE_TYPE_CONFIG[nodeType];
      let label = config.label;
      let newCounters = { ...counters };

      if (nodeType === 'upsell') {
        newCounters.upsell += 1;
        label = `Upsell ${newCounters.upsell}`;
        setCounters(newCounters);
      } else if (nodeType === 'downsell') {
        newCounters.downsell += 1;
        label = `Downsell ${newCounters.downsell}`;
        setCounters(newCounters);
      }

      const newNode: FunnelNode = {
        id: `${nodeType}-${Date.now()}`,
        type: 'funnelNode',
        position,
        data: {
          label,
          nodeType,
          buttonLabel: config.buttonLabel,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [counters, saveToHistory]
  );

  const deleteNode = useCallback((nodeId: string) => {
    saveToHistory();
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [saveToHistory]);

  const deleteEdge = useCallback((edgeId: string) => {
    saveToHistory();
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, [saveToHistory]);

  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedEdges = edges.filter((e) => e.selected);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
    
    saveToHistory();
    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)));
  }, [nodes, edges, saveToHistory]);

  const clearCanvas = useCallback(() => {
    saveToHistory();
    setNodes([]);
    setEdges([]);
    setCounters({ upsell: 0, downsell: 0 });
  }, [saveToHistory]);

  const exportJSON = useCallback(() => {
    const state: FunnelState = { nodes, edges, counters };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'funnel-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, counters]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        saveToHistory();
        const state: FunnelState = JSON.parse(e.target?.result as string);
        setNodes(state.nodes);
        setEdges(state.edges);
        setCounters(state.counters);
      } catch (err) {
        console.error('Failed to import JSON:', err);
      }
    };
    reader.readAsText(file);
  }, [saveToHistory]);

  // Validation: Check for warnings
  const getValidationWarnings = useCallback(() => {
    const warnings: string[] = [];
    
    // Check for orphan nodes (no connections)
    const connectedNodeIds = new Set([
      ...edges.map((e) => e.source),
      ...edges.map((e) => e.target),
    ]);
    const orphanNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));
    if (orphanNodes.length > 0) {
      warnings.push(`${orphanNodes.length} orphan node${orphanNodes.length > 1 ? 's' : ''} detected`);
    }

    // Check Sales Page connections
    const salesNodes = nodes.filter((n) => n.data.nodeType === 'sales');
    salesNodes.forEach((node) => {
      const outgoingEdges = edges.filter((e) => e.source === node.id);
      if (outgoingEdges.length !== 1) {
        warnings.push(`${node.data.label} should have exactly 1 outgoing connection`);
      }
    });

    return warnings;
  }, [nodes, edges]);

  // Update node warnings
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        let hasWarning = false;
        let warningMessage = '';

        // Check if orphan
        const isConnected = edges.some((e) => e.source === node.id || e.target === node.id);
        if (!isConnected) {
          hasWarning = true;
          warningMessage = 'No connections';
        }

        // Check Sales Page specific rule
        if (node.data.nodeType === 'sales') {
          const outgoingEdges = edges.filter((e) => e.source === node.id);
          if (outgoingEdges.length !== 1) {
            hasWarning = true;
            warningMessage = outgoingEdges.length === 0 
              ? 'Needs 1 outgoing connection' 
              : 'Should have exactly 1 outgoing connection';
          }
        }

        return {
          ...node,
          data: { ...node.data, hasWarning, warningMessage },
        };
      })
    );
  }, [edges]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    deleteEdge,
    deleteSelected,
    clearCanvas,
    exportJSON,
    importJSON,
    getValidationWarnings,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
