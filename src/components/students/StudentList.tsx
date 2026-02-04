import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Trash2, Edit, ArrowUpDown } from 'lucide-react';
import { Student } from '@/types';
import { cn } from '@/lib/utils';

export function StudentList() {
  const { students, classes, deleteStudent, updateStudent, addStudent, setStudents } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', className: '' });

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
    
    result = [...result].sort((a, b) => {
      if (sortBy === 'id') {
        return a.id.localeCompare(b.id);
      }
      return a.lastName.localeCompare(b.lastName);
    });
    
    return result;
  }, [students, selectedClass, searchQuery, sortBy]);

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName && newStudent.className) {
      addStudent({
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        className: newStudent.className,
      });
      setNewStudent({ firstName: '', lastName: '', className: '' });
      setShowAddDialog(false);
    }
  };

  const handleUpdateStudent = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, {
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        className: editingStudent.className,
      });
      setEditingStudent(null);
    }
  };

  const getSanctionColor = (level: Student['sanctionLevel']) => {
    switch (level) {
      case 'yellow': return 'bg-warning-yellow text-black';
      case 'orange': return 'bg-warning-orange text-white';
      case 'red': return 'bg-warning-red text-white';
      case 'black': return 'bg-warning-black text-white';
      default: return 'bg-success text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un élève..."
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

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortBy(prev => prev === 'id' ? 'name' : 'id')}
          title={`Trier par ${sortBy === 'id' ? 'nom' : 'ID'}`}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>

        <Button size="icon" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Student List */}
      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredStudents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {students.length === 0 ? "Aucun élève. Importez une liste pour commencer." : "Aucun résultat."}
          </p>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                  getSanctionColor(student.sanctionLevel)
                )}>
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.id} • {student.className}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getSanctionColor(student.sanctionLevel)
                )}>
                  {student.sanctionCount}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingStudent(student)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteStudent(student.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Ajouter un élève</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Prénom</Label>
              <Input
                value={newStudent.firstName}
                onChange={(e) => setNewStudent(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Nom</Label>
              <Input
                value={newStudent.lastName}
                onChange={(e) => setNewStudent(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Classe</Label>
              <Input
                value={newStudent.className}
                onChange={(e) => setNewStudent(prev => ({ ...prev, className: e.target.value }))}
                placeholder="Ex: 1S1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Annuler</Button>
            <Button onClick={handleAddStudent}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Modifier l'élève</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Prénom</Label>
                <Input
                  value={editingStudent.firstName}
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Nom</Label>
                <Input
                  value={editingStudent.lastName}
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Classe</Label>
                <Input
                  value={editingStudent.className}
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, className: e.target.value } : null)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>Annuler</Button>
            <Button onClick={handleUpdateStudent}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
