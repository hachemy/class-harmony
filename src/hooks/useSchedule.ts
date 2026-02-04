import { useCallback } from 'react';
import { TeacherSchedule, ScheduleCell, Session, DAYS_OF_WEEK, TIME_SLOTS } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const createEmptySchedule = (): TeacherSchedule => {
  const schedule: TeacherSchedule = {};
  DAYS_OF_WEEK.forEach((day) => {
    schedule[day] = {};
    TIME_SLOTS.forEach((_, index) => {
      schedule[day][index] = null;
    });
  });
  return schedule;
};

export function useSchedule() {
  const [schedule, setSchedule] = useLocalStorage<TeacherSchedule>('classroom-schedule', createEmptySchedule());
  const [sessions, setSessions] = useLocalStorage<Session[]>('classroom-sessions', []);

  const updateCell = useCallback((day: string, slot: number, cell: ScheduleCell | null) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: cell,
      },
    }));
  }, [setSchedule]);

  const mergeCells = useCallback((day: string, startSlot: number, endSlot: number) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const firstCell = newSchedule[day][startSlot];
      
      if (firstCell) {
        newSchedule[day][startSlot] = {
          ...firstCell,
          isMerged: true,
          colspan: endSlot - startSlot + 1,
        };
        
        for (let i = startSlot + 1; i <= endSlot; i++) {
          newSchedule[day][i] = {
            id: `merged-${day}-${i}`,
            className: '',
            room: '',
            mergedWith: firstCell.id,
          };
        }
      }
      
      return newSchedule;
    });
  }, [setSchedule]);

  const createSession = useCallback((session: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...session,
      id: crypto.randomUUID(),
    };
    setSessions((prev) => [...prev, newSession]);
    return newSession;
  }, [setSessions]);

  const getSessionsByDay = useCallback((day: string) => {
    return sessions.filter((s) => s.day === day);
  }, [sessions]);

  const getSessionsByClass = useCallback((className: string) => {
    return sessions.filter((s) => s.className === className);
  }, [sessions]);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, [setSessions]);

  const clearSchedule = useCallback(() => {
    setSchedule(createEmptySchedule());
  }, [setSchedule]);

  return {
    schedule,
    sessions,
    updateCell,
    mergeCells,
    createSession,
    getSessionsByDay,
    getSessionsByClass,
    deleteSession,
    clearSchedule,
  };
}
