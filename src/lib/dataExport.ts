import { Student, Sanction, Rachat, Session, TeacherSchedule } from '@/types';

export interface ExportData {
  version: string;
  exportDate: string;
  students: Student[];
  sanctions: Sanction[];
  rachats: Rachat[];
  schedule: TeacherSchedule;
  sessions: Session[];
}

export function exportData(): ExportData {
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    students: JSON.parse(localStorage.getItem('classroom-students') || '[]'),
    sanctions: JSON.parse(localStorage.getItem('classroom-sanctions') || '[]'),
    rachats: JSON.parse(localStorage.getItem('classroom-rachats') || '[]'),
    schedule: JSON.parse(localStorage.getItem('classroom-schedule') || '{}'),
    sessions: JSON.parse(localStorage.getItem('classroom-sessions') || '[]'),
  };
  return data;
}

export function downloadExport(): void {
  const data = exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gestion-classe-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importData(data: ExportData): { success: boolean; message: string } {
  try {
    if (!data.version || !data.exportDate) {
      return { success: false, message: 'Format de fichier invalide' };
    }

    // Validate arrays exist
    if (!Array.isArray(data.students) || !Array.isArray(data.sanctions) || !Array.isArray(data.rachats)) {
      return { success: false, message: 'Données corrompues ou manquantes' };
    }

    // Store all data
    localStorage.setItem('classroom-students', JSON.stringify(data.students));
    localStorage.setItem('classroom-sanctions', JSON.stringify(data.sanctions));
    localStorage.setItem('classroom-rachats', JSON.stringify(data.rachats));
    
    if (data.schedule && typeof data.schedule === 'object') {
      localStorage.setItem('classroom-schedule', JSON.stringify(data.schedule));
    }
    
    if (Array.isArray(data.sessions)) {
      localStorage.setItem('classroom-sessions', JSON.stringify(data.sessions));
    }

    return { 
      success: true, 
      message: `Import réussi: ${data.students.length} élèves, ${data.sanctions.length} sanctions, ${data.rachats.length} rachats` 
    };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, message: 'Erreur lors de l\'import' };
  }
}

export function parseImportFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch {
        reject(new Error('Fichier JSON invalide'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(file);
  });
}

export function mergeData(existingData: ExportData, newData: ExportData): ExportData {
  // Merge students (by ID)
  const existingStudentIds = new Set(existingData.students.map(s => s.id));
  const newStudents = newData.students.filter(s => !existingStudentIds.has(s.id));
  
  // Merge sanctions (by ID)
  const existingSanctionIds = new Set(existingData.sanctions.map(s => s.id));
  const newSanctions = newData.sanctions.filter(s => !existingSanctionIds.has(s.id));
  
  // Merge rachats (by ID)
  const existingRachatIds = new Set(existingData.rachats.map(r => r.id));
  const newRachats = newData.rachats.filter(r => !existingRachatIds.has(r.id));
  
  // Merge sessions (by ID)
  const existingSessionIds = new Set(existingData.sessions.map(s => s.id));
  const newSessions = newData.sessions.filter(s => !existingSessionIds.has(s.id));

  return {
    version: newData.version,
    exportDate: new Date().toISOString(),
    students: [...existingData.students, ...newStudents],
    sanctions: [...existingData.sanctions, ...newSanctions],
    rachats: [...existingData.rachats, ...newRachats],
    schedule: { ...existingData.schedule, ...newData.schedule },
    sessions: [...existingData.sessions, ...newSessions],
  };
}