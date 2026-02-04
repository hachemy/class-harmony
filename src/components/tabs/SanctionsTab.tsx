import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentSelector } from '../students/StudentSelector';
import { SanctionForm } from '../sanctions/SanctionForm';
import { RachatForm } from '../sanctions/RachatForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Heart } from 'lucide-react';
import { Student } from '@/types';

export function SanctionsTab() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display">Sélectionner un élève</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentSelector 
            onSelect={setSelectedStudent} 
            selectedStudent={selectedStudent}
          />
        </CardContent>
      </Card>

      {selectedStudent && (
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
              </span>
              {selectedStudent.firstName} {selectedStudent.lastName}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selectedStudent.className})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sanction" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="sanction" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Sanctionner
                </TabsTrigger>
                <TabsTrigger value="rachat" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Racheter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sanction">
                <SanctionForm student={selectedStudent} onComplete={() => setSelectedStudent(null)} />
              </TabsContent>
              
              <TabsContent value="rachat">
                <RachatForm student={selectedStudent} onComplete={() => setSelectedStudent(null)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
