import { useCallback, useMemo } from 'react';
import { Student } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useStudents() {
  const [students, setStudents] = useLocalStorage<Student[]>('classroom-students', []);

  const addStudent = useCallback((student: Omit<Student, 'id' | 'sanctionCount' | 'sanctionLevel'>) => {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      sanctionCount: 0,
      sanctionLevel: 'none',
    };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  }, [setStudents]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, [setStudents]);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, [setStudents]);

  const importStudents = useCallback((text: string) => {
    const lines = text.trim().split('\n');
    const newStudents: Student[] = [];
    let currentClass = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('#') || trimmedLine === '' || trimmedLine.includes('ID | Prénom')) {
        continue;
      }

      const parts = trimmedLine.split(';').map((p) => p.trim());
      
      if (parts.length >= 4) {
        const [id, firstName, lastName, className] = parts;
        currentClass = className || currentClass;
        
        newStudents.push({
          id: `${className}-${id}`,
          firstName,
          lastName,
          className: currentClass,
          sanctionCount: 0,
          sanctionLevel: 'none',
        });
      }
    }

    setStudents((prev) => [...prev, ...newStudents]);
    return newStudents.length;
  }, [setStudents]);

  const getStudentsByClass = useCallback((className: string) => {
    return students.filter((s) => s.className === className);
  }, [students]);

  const getStudentById = useCallback((id: string) => {
    return students.find((s) => s.id === id);
  }, [students]);

  const searchStudents = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(lowerQuery) ||
        s.lastName.toLowerCase().includes(lowerQuery) ||
        s.id.toLowerCase().includes(lowerQuery)
    );
  }, [students]);

  const classes = useMemo(() => {
    return [...new Set(students.map((s) => s.className))].sort();
  }, [students]);

  const incrementSanction = useCallback((studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newCount = s.sanctionCount + 1;
        let newLevel: Student['sanctionLevel'] = 'none';
        if (newCount === 1) newLevel = 'yellow';
        else if (newCount === 2) newLevel = 'orange';
        else if (newCount === 3) newLevel = 'red';
        else if (newCount >= 4) newLevel = 'black';
        return { ...s, sanctionCount: newCount, sanctionLevel: newLevel };
      })
    );
  }, [setStudents]);

  const decrementSanction = useCallback((studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newCount = Math.max(0, s.sanctionCount - 1);
        let newLevel: Student['sanctionLevel'] = 'none';
        if (newCount === 1) newLevel = 'yellow';
        else if (newCount === 2) newLevel = 'orange';
        else if (newCount === 3) newLevel = 'red';
        else if (newCount >= 4) newLevel = 'black';
        return { ...s, sanctionCount: newCount, sanctionLevel: newLevel };
      })
    );
  }, [setStudents]);

  return {
    students,
    setStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudents,
    getStudentsByClass,
    getStudentById,
    searchStudents,
    classes,
    incrementSanction,
    decrementSanction,
  };
}
