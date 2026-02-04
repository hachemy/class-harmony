import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/types';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentSelectorProps {
  onSelect: (student: Student | null) => void;
  selectedStudent: Student | null;
}

export function StudentSelector({ onSelect, selectedStudent }: StudentSelectorProps) {
  const { students, classes } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    let result = students;
    
    if (selectedClass !== 'all') {
      result = result.filter(s => s.className === selectedClass);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [students, selectedClass, searchQuery]);

  const getSanctionColor = (level: Student['sanctionLevel']) => {
    switch (level) {
      case 'yellow': return 'border-warning-yellow bg-warning-yellow/10';
      case 'orange': return 'border-warning-orange bg-warning-orange/10';
      case 'red': return 'border-warning-red bg-warning-red/10';
      case 'black': return 'border-warning-black bg-warning-black/10';
      default: return 'border-success bg-success/10';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-4">
            Aucun élève trouvé
          </p>
        ) : (
          filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => onSelect(selectedStudent?.id === student.id ? null : student)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                getSanctionColor(student.sanctionLevel),
                selectedStudent?.id === student.id && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <p className="font-medium text-sm truncate">
                {student.firstName} {student.lastName[0]}.
              </p>
              <p className="text-xs text-muted-foreground">
                {student.id}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
