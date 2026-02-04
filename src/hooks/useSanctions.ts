import { useCallback, useMemo } from 'react';
import { Sanction } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useSanctions() {
  const [sanctions, setSanctions] = useLocalStorage<Sanction[]>('classroom-sanctions', []);

  const addSanction = useCallback((sanction: Omit<Sanction, 'id' | 'time'>) => {
    const newSanction: Sanction = {
      ...sanction,
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setSanctions((prev) => [...prev, newSanction]);
    return newSanction;
  }, [setSanctions]);

  const getSanctionsByStudent = useCallback((studentId: string) => {
    return sanctions
      .filter((s) => s.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sanctions]);

  const getSanctionCountByStudent = useCallback((studentId: string) => {
    return sanctions.filter((s) => s.studentId === studentId).length;
  }, [sanctions]);

  const getRecentSanctions = useCallback((limit: number = 10) => {
    return [...sanctions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [sanctions]);

  const getTodaySanctions = useCallback(() => {
    const today = new Date().toDateString();
    return sanctions.filter((s) => new Date(s.date).toDateString() === today);
  }, [sanctions]);

  const sanctionsByLevel = useMemo(() => {
    return {
      yellow: sanctions.filter((s) => s.level === 'yellow').length,
      orange: sanctions.filter((s) => s.level === 'orange').length,
      red: sanctions.filter((s) => s.level === 'red').length,
      black: sanctions.filter((s) => s.level === 'black').length,
    };
  }, [sanctions]);

  const deleteSanction = useCallback((id: string) => {
    setSanctions((prev) => prev.filter((s) => s.id !== id));
  }, [setSanctions]);

  return {
    sanctions,
    addSanction,
    getSanctionsByStudent,
    getSanctionCountByStudent,
    getRecentSanctions,
    getTodaySanctions,
    sanctionsByLevel,
    deleteSanction,
  };
}
