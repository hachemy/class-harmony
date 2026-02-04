import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { FileText, Upload } from 'lucide-react';

interface ImportStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportStudentsDialog({ open, onOpenChange }: ImportStudentsDialogProps) {
  const { importStudents } = useApp();
  const [text, setText] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const exampleText = `ID | Prénom | Nom | Classe
01; Jean ; Dupont ; 1S1
02; Marie ; Calin ; 1S1
03; Joël ; Martin ; 1S1
04; Adrien ; Turin ; 1S1
##########################
01; Jacques ; Dana ; 2S4
02; Sara ; Sanchez ; 2S4
03; Dina ; Gonzalo ; 2S4`;

  const handleImport = () => {
    const count = importStudents(text);
    setResult(count);
  };

  const handleClose = () => {
    onOpenChange(false);
    setText('');
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importer une liste d'élèves
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild className="cursor-pointer">
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Charger un fichier
                </span>
              </Button>
            </label>
            <span className="text-sm text-muted-foreground">ou collez le texte ci-dessous</span>
          </div>

          <Textarea
            placeholder={exampleText}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Format attendu:</strong></p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`ID; Prénom; Nom; Classe
01; Jean; Dupont; 1S1
02; Marie; Calin; 1S1
########################## (séparateur de classe)`}
            </pre>
          </div>

          {result !== null && (
            <div className="p-3 rounded-lg bg-success/10 text-success border border-success/20">
              ✓ {result} élève(s) importé(s) avec succès
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
          <Button onClick={handleImport} disabled={!text.trim()}>
            Importer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
