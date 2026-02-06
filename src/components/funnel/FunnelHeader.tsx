import { useRef } from 'react';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Trash2, 
  Undo2, 
  Redo2,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface FunnelHeaderProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDeleteSelected: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const FunnelHeader = ({ 
  onExport, 
  onImport, 
  onClear,
  onUndo,
  onRedo,
  onDeleteSelected,
  canUndo,
  canRedo,
}: FunnelHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="h-12 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-sm font-medium text-foreground tracking-tight">
            Cart Panda Funnel
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {/* Undo/Redo Group */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="h-8 w-8"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
          
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="h-8 w-8"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
      
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1.5" />

          {/* Delete Selected */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteSelected}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <Separator orientation="vertical" className="h-5 mx-1.5" />

          {/* Import/Export Group */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleImportClick}
                className="h-8 w-8"
              >
                <ArrowUpFromLine className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onExport}
                className="h-8 w-8"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <Separator orientation="vertical" className="h-5 mx-1.5" />

          {/* Clear Canvas */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    Clear
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Canvas?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all nodes and connections from your funnel. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClear} className="bg-destructive hover:bg-destructive/90">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default FunnelHeader;
