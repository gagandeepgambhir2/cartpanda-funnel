import { LucideIcon, FileText, ShoppingCart, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

export type NodeType = 'sales' | 'order' | 'upsell' | 'downsell' | 'thankyou';

export interface FunnelNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  buttonLabel: string;
  hasWarning?: boolean;
  warningMessage?: string;
}

export interface FunnelState {
  nodes: import('@xyflow/react').Node<FunnelNodeData>[];
  edges: import('@xyflow/react').Edge[];
  counters: {
    upsell: number;
    downsell: number;
  };
}

export const NODE_TYPE_CONFIG: Record<NodeType, { 
  label: string; 
  buttonLabel: string; 
  color: string;
  Icon: LucideIcon;
}> = {
  sales: {
    label: 'Sales Page',
    buttonLabel: 'Buy Now',
    color: 'node-sales',
    Icon: FileText,
  },
  order: {
    label: 'Order Page',
    buttonLabel: 'Complete Order',
    color: 'node-order',
    Icon: ShoppingCart,
  },
  upsell: {
    label: 'Upsell',
    buttonLabel: 'Yes, Add This!',
    color: 'node-upsell',
    Icon: TrendingUp,
  },
  downsell: {
    label: 'Downsell',
    buttonLabel: 'Get This Instead',
    color: 'node-downsell',
    Icon: TrendingDown,
  },
  thankyou: {
    label: 'Thank You',
    buttonLabel: 'View Order',
    color: 'node-thankyou',
    Icon: CheckCircle,
  },
};
