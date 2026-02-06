import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationPanelProps {
  warnings: string[];
}

const ValidationPanel = ({ warnings }: ValidationPanelProps) => {
  const hasWarnings = warnings.length > 0;

  return (
    <div
      className={`
        absolute bottom-4 left-1/2 -translate-x-1/2
        bg-card border rounded-lg shadow-lg px-4 py-2
        flex items-center gap-2 text-sm
        transition-all duration-300
        ${hasWarnings ? 'border-destructive/50' : 'border-border'}
      `}
    >
      {hasWarnings ? (
        <>
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-muted-foreground">
            {warnings.slice(0, 2).join(' • ')}
            {warnings.length > 2 && ` (+${warnings.length - 2} more)`}
          </span>
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 text-node-order" />
          <span className="text-muted-foreground">Funnel looks good!</span>
        </>
      )}
    </div>
  );
};

export default ValidationPanel;
