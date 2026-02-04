import { useCallback, useMemo } from 'react';
import { Rachat } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useRachats() {
  const [rachats, setRachats] = useLocalStorage<Rachat[]>('classroom-rachats', []);

  const addRachat = useCallback((rachat: Omit<Rachat, 'id' | 'validated'>) => {
    const newRachat: Rachat = {
      ...rachat,
      id: crypto.randomUUID(),
      validated: false,
    };
    setRachats((prev) => [...prev, newRachat]);
    return newRachat;
  }, [setRachats]);

  const validateRachat = useCallback((id: string, validatedBy: string) => {
    setRachats((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, validated: true, validatedBy } : r
      )
    );
  }, [setRachats]);

  const getRachatsByStudent = useCallback((studentId: string) => {
    return rachats
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rachats]);

  const getPendingRachats = useCallback(() => {
    return rachats.filter((r) => !r.validated);
  }, [rachats]);

  const getValidatedRachats = useCallback(() => {
    return rachats.filter((r) => r.validated);
  }, [rachats]);

  const totalPointsRedeemed = useMemo(() => {
    return rachats
      .filter((r) => r.validated)
      .reduce((sum, r) => sum + r.pointsRedeemed, 0);
  }, [rachats]);

  const deleteRachat = useCallback((id: string) => {
    setRachats((prev) => prev.filter((r) => r.id !== id));
  }, [setRachats]);

  return {
    rachats,
    addRachat,
    validateRachat,
    getRachatsByStudent,
    getPendingRachats,
    getValidatedRachats,
    totalPointsRedeemed,
    deleteRachat,
  };
}
