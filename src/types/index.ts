export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  className: string;
  sanctionCount: number;
  sanctionLevel: 'none' | 'yellow' | 'orange' | 'red' | 'black';
  photo?: string;
}

export interface Sanction {
  id: string;
  studentId: string;
  reason: string;
  date: Date;
  time: string;
  level: 'yellow' | 'orange' | 'red' | 'black';
  sessionId?: string;
}

export interface Rachat {
  id: string;
  studentId: string;
  reason: string;
  date: Date;
  pointsRedeemed: number;
  validated: boolean;
  validatedBy?: string;
}

export interface Session {
  id: string;
  day: string;
  date: Date;
  timeSlot: string;
  className: string;
  room?: string;
}

export interface ScheduleCell {
  id: string;
  className: string;
  room: string;
  isMerged?: boolean;
  mergedWith?: string;
  colspan?: number;
}

export interface TeacherSchedule {
  [day: string]: {
    [slot: number]: ScheduleCell | null;
  };
}

export type SanctionReason = {
  id: string;
  label: string;
};

export type RachatReason = {
  id: string;
  label: string;
  points: number;
};

export const DEFAULT_SANCTION_REASONS: SanctionReason[] = [
  { id: '1', label: 'Bavardage en classe' },
  { id: '2', label: 'Retard non justifié' },
  { id: '3', label: 'Devoir non rendu' },
  { id: '4', label: 'Manque de respect' },
  { id: '5', label: 'Utilisation du téléphone' },
  { id: '6', label: 'Perturbation du cours' },
  { id: '7', label: 'Absence de matériel' },
  { id: '8', label: 'Autre' },
];

export const DEFAULT_RACHAT_REASONS: RachatReason[] = [
  { id: '1', label: 'Travail supplémentaire effectué', points: 1 },
  { id: '2', label: 'Excuses présentées', points: 1 },
  { id: '3', label: 'Bon comportement maintenu', points: 1 },
  { id: '4', label: 'Aide apportée à un camarade', points: 1 },
  { id: '5', label: 'Participation active en cours', points: 1 },
  { id: '6', label: 'Service rendu à la classe', points: 2 },
];

export const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

export const TIME_SLOTS = [
  '08h30 - 09h30',
  '09h30 - 10h30',
  '10h30 - 11h30',
  '11h30 - 12h30',
  '14h00 - 15h00',
  '15h00 - 16h00',
  '16h00 - 17h00',
  '17h00 - 18h00',
];
