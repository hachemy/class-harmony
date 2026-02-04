import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TeacherScheduleTable } from '../schedule/TeacherScheduleTable';
import { StudentList } from '../students/StudentList';
import { ImportStudentsDialog } from '../students/ImportStudentsDialog';
import { CreateSessionDialog } from '../schedule/CreateSessionDialog';

export function GestionTab() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Schedule Section */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">Emploi du temps</CardTitle>
          <Button 
            size="sm" 
            onClick={() => setShowSessionDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Créer séance
          </Button>
        </CardHeader>
        <CardContent>
          <TeacherScheduleTable />
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">Liste des élèves</CardTitle>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowImportDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Importer
          </Button>
        </CardHeader>
        <CardContent>
          <StudentList />
        </CardContent>
      </Card>

      <ImportStudentsDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog} 
      />
      
      <CreateSessionDialog
        open={showSessionDialog}
        onOpenChange={setShowSessionDialog}
      />
    </div>
  );
}
