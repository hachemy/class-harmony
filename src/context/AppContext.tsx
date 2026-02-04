import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Sanction, Rachat, Session, TeacherSchedule } from '@/types';
import { useStudents } from '@/hooks/useStudents';
import { useSanctions } from '@/hooks/useSanctions';
import { useRachats } from '@/hooks/useRachats';
import { useSchedule } from '@/hooks/useSchedule';

interface ActiveSanctionCard {
  student: Student;
  sanction: Sanction;
  isMinimized: boolean;
}

interface AppContextType {
  // Students
  students: Student[];
  addStudent: ReturnType<typeof useStudents>['addStudent'];
  updateStudent: ReturnType<typeof useStudents>['updateStudent'];
  deleteStudent: ReturnType<typeof useStudents>['deleteStudent'];
  importStudents: ReturnType<typeof useStudents>['importStudents'];
  getStudentsByClass: ReturnType<typeof useStudents>['getStudentsByClass'];
  getStudentById: ReturnType<typeof useStudents>['getStudentById'];
  searchStudents: ReturnType<typeof useStudents>['searchStudents'];
  classes: string[];
  incrementSanction: ReturnType<typeof useStudents>['incrementSanction'];
  decrementSanction: ReturnType<typeof useStudents>['decrementSanction'];
  setStudents: ReturnType<typeof useStudents>['setStudents'];
  
  // Sanctions
  sanctions: Sanction[];
  addSanction: ReturnType<typeof useSanctions>['addSanction'];
  getSanctionsByStudent: ReturnType<typeof useSanctions>['getSanctionsByStudent'];
  getSanctionCountByStudent: ReturnType<typeof useSanctions>['getSanctionCountByStudent'];
  getRecentSanctions: ReturnType<typeof useSanctions>['getRecentSanctions'];
  getTodaySanctions: ReturnType<typeof useSanctions>['getTodaySanctions'];
  sanctionsByLevel: ReturnType<typeof useSanctions>['sanctionsByLevel'];
  
  // Rachats
  rachats: Rachat[];
  addRachat: ReturnType<typeof useRachats>['addRachat'];
  validateRachat: ReturnType<typeof useRachats>['validateRachat'];
  getRachatsByStudent: ReturnType<typeof useRachats>['getRachatsByStudent'];
  getPendingRachats: ReturnType<typeof useRachats>['getPendingRachats'];
  totalPointsRedeemed: number;
  
  // Schedule
  schedule: TeacherSchedule;
  sessions: Session[];
  updateCell: ReturnType<typeof useSchedule>['updateCell'];
  createSession: ReturnType<typeof useSchedule>['createSession'];
  deleteSession: ReturnType<typeof useSchedule>['deleteSession'];
  
  // Active sanction cards
  activeSanctionCards: ActiveSanctionCard[];
  addActiveSanctionCard: (student: Student, sanction: Sanction) => void;
  removeActiveSanctionCard: (studentId: string) => void;
  minimizeSanctionCard: (studentId: string) => void;
  
  // Selected class
  selectedClass: string;
  setSelectedClass: (className: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const studentsHook = useStudents();
  const sanctionsHook = useSanctions();
  const rachatsHook = useRachats();
  const scheduleHook = useSchedule();
  
  const [activeSanctionCards, setActiveSanctionCards] = useState<ActiveSanctionCard[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');

  const addActiveSanctionCard = (student: Student, sanction: Sanction) => {
    setActiveSanctionCards((prev) => {
      const existing = prev.findIndex((c) => c.student.id === student.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { student, sanction, isMinimized: false };
        return updated;
      }
      return [...prev, { student, sanction, isMinimized: false }];
    });
  };

  const removeActiveSanctionCard = (studentId: string) => {
    setActiveSanctionCards((prev) => prev.filter((c) => c.student.id !== studentId));
  };

  const minimizeSanctionCard = (studentId: string) => {
    setActiveSanctionCards((prev) =>
      prev.map((c) =>
        c.student.id === studentId ? { ...c, isMinimized: true } : c
      )
    );
  };

  const value: AppContextType = {
    // Students
    students: studentsHook.students,
    addStudent: studentsHook.addStudent,
    updateStudent: studentsHook.updateStudent,
    deleteStudent: studentsHook.deleteStudent,
    importStudents: studentsHook.importStudents,
    getStudentsByClass: studentsHook.getStudentsByClass,
    getStudentById: studentsHook.getStudentById,
    searchStudents: studentsHook.searchStudents,
    classes: studentsHook.classes,
    incrementSanction: studentsHook.incrementSanction,
    decrementSanction: studentsHook.decrementSanction,
    setStudents: studentsHook.setStudents,
    
    // Sanctions
    sanctions: sanctionsHook.sanctions,
    addSanction: sanctionsHook.addSanction,
    getSanctionsByStudent: sanctionsHook.getSanctionsByStudent,
    getSanctionCountByStudent: sanctionsHook.getSanctionCountByStudent,
    getRecentSanctions: sanctionsHook.getRecentSanctions,
    getTodaySanctions: sanctionsHook.getTodaySanctions,
    sanctionsByLevel: sanctionsHook.sanctionsByLevel,
    
    // Rachats
    rachats: rachatsHook.rachats,
    addRachat: rachatsHook.addRachat,
    validateRachat: rachatsHook.validateRachat,
    getRachatsByStudent: rachatsHook.getRachatsByStudent,
    getPendingRachats: rachatsHook.getPendingRachats,
    totalPointsRedeemed: rachatsHook.totalPointsRedeemed,
    
    // Schedule
    schedule: scheduleHook.schedule,
    sessions: scheduleHook.sessions,
    updateCell: scheduleHook.updateCell,
    createSession: scheduleHook.createSession,
    deleteSession: scheduleHook.deleteSession,
    
    // Active sanction cards
    activeSanctionCards,
    addActiveSanctionCard,
    removeActiveSanctionCard,
    minimizeSanctionCard,
    
    // Selected class
    selectedClass,
    setSelectedClass,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
