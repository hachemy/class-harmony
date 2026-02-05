import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { downloadExport, parseImportFile, importData, exportData, mergeData } from '@/lib/dataExport';
import { useToast } from '@/hooks/use-toast';

interface DataExportImportProps {
  onDataImported?: () => void;
}

export function DataExportImport({ onDataImported }: DataExportImportProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    downloadExport();
    toast({
      title: 'Export réussi',
      description: 'Le fichier a été téléchargé',
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setShowImportDialog(true);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportConfirm = async () => {
    if (!pendingFile) return;

    setIsProcessing(true);
    try {
      const newData = await parseImportFile(pendingFile);
      
      let result;
      if (importMode === 'merge') {
        const currentData = exportData();
        const mergedData = mergeData(currentData, newData);
        result = importData(mergedData);
      } else {
        result = importData(newData);
      }

      if (result.success) {
        toast({
          title: 'Import réussi',
          description: result.message,
        });
        onDataImported?.();
        // Reload the page to refresh all data from localStorage
        window.location.reload();
      } else {
        toast({
          title: 'Erreur',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setShowImportDialog(false);
      setPendingFile(null);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Importer
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-orange" />
              Importer des données
            </DialogTitle>
            <DialogDescription>
              Comment souhaitez-vous gérer les données importées ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <button
              onClick={() => setImportMode('replace')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                importMode === 'replace' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="font-medium">Remplacer toutes les données</div>
              <div className="text-sm text-muted-foreground">
                Supprime les données existantes et les remplace par les nouvelles
              </div>
            </button>
            
            <button
              onClick={() => setImportMode('merge')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                importMode === 'merge' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="font-medium">Fusionner avec les données existantes</div>
              <div className="text-sm text-muted-foreground">
                Ajoute les nouvelles données sans supprimer les existantes
              </div>
            </button>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowImportDialog(false);
                setPendingFile(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleImportConfirm} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Import en cours...' : 'Confirmer l\'import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}