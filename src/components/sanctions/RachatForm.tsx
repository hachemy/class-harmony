import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, DEFAULT_RACHAT_REASONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

interface RachatFormProps {
  student: Student;
  onComplete: () => void;
}

export function RachatForm({ student, onComplete }: RachatFormProps) {
  const { addRachat, decrementSanction, validateRachat, removeActiveSanctionCard } = useApp();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = () => {
    const finalReason = reason === 'custom' ? customReason : reason;
    if (!finalReason || student.sanctionCount === 0) return;

    const rachat = addRachat({
      studentId: student.id,
      reason: finalReason,
      date: new Date(),
      pointsRedeemed: 1,
    });

    // Auto-validate and apply
    validateRachat(rachat.id, 'Enseignant');
    decrementSanction(student.id);
    
    // Remove card if sanctions are cleared
    if (student.sanctionCount <= 1) {
      removeActiveSanctionCard(student.id);
    }

    setReason('');
    setCustomReason('');
    onComplete();
  };

  if (student.sanctionCount === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-success" />
        </div>
        <h3 className="font-display font-medium text-lg mb-2">Aucune sanction</h3>
        <p className="text-muted-foreground">
          {student.firstName} n'a aucune sanction à racheter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-success/10 border border-success/20 text-success rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          <span className="font-medium">Racheter une sanction</span>
        </div>
        <p className="text-sm opacity-90">
          {student.firstName} {student.lastName} a {student.sanctionCount} sanction(s).
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Motif du rachat</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un motif" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_RACHAT_REASONS.map((r) => (
                <SelectItem key={r.id} value={r.label}>{r.label}</SelectItem>
              ))}
              <SelectItem value="custom">Autre (personnalisé)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reason === 'custom' && (
          <div className="grid gap-2">
            <Label>Motif personnalisé</Label>
            <Input
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Décrivez le motif..."
            />
          </div>
        )}
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={!reason || (reason === 'custom' && !customReason)}
        className="w-full bg-success hover:bg-success/90"
      >
        <Heart className="h-4 w-4 mr-2" />
        Valider le rachat
      </Button>
    </div>
  );
}
