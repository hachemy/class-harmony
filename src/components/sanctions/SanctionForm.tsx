import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, DEFAULT_SANCTION_REASONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface SanctionFormProps {
  student: Student;
  onComplete: () => void;
}

export function SanctionForm({ student, onComplete }: SanctionFormProps) {
  const { addSanction, incrementSanction, addActiveSanctionCard, getStudentById } = useApp();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const getSanctionLevel = (count: number): 'yellow' | 'orange' | 'red' | 'black' => {
    if (count === 0) return 'yellow';
    if (count === 1) return 'orange';
    if (count === 2) return 'red';
    return 'black';
  };

  const handleSubmit = () => {
    const finalReason = reason === 'custom' ? customReason : reason;
    if (!finalReason) return;

    const level = getSanctionLevel(student.sanctionCount);
    
    const sanction = addSanction({
      studentId: student.id,
      reason: finalReason,
      date: new Date(),
      level,
    });

    incrementSanction(student.id);
    
    // Get updated student for the card
    setTimeout(() => {
      const updatedStudent = getStudentById(student.id);
      if (updatedStudent) {
        addActiveSanctionCard(updatedStudent, sanction);
      }
    }, 0);

    setReason('');
    setCustomReason('');
    onComplete();
  };

  const getLevelInfo = () => {
    const nextLevel = getSanctionLevel(student.sanctionCount);
    const colors = {
      yellow: { bg: 'bg-warning-yellow', text: 'Carton Jaune (1ère sanction)' },
      orange: { bg: 'bg-warning-orange', text: 'Carton Orange (2ème sanction)' },
      red: { bg: 'bg-warning-red', text: 'Carton Rouge (3ème sanction)' },
      black: { bg: 'bg-warning-black', text: 'Carton Noir (4ème+ sanction)' },
    };
    return colors[nextLevel];
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className={`${levelInfo.bg} text-white rounded-lg p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">{levelInfo.text}</span>
        </div>
        <p className="text-sm opacity-90">
          {student.firstName} {student.lastName} recevra cette sanction.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Motif de la sanction</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un motif" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_SANCTION_REASONS.map((r) => (
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
        className="w-full"
        variant="destructive"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Appliquer la sanction
      </Button>
    </div>
  );
}
