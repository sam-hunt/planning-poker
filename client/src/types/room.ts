import type { User } from './user';

export interface Room {
  isRevealed: boolean;
  lastResetAt: string;
  users: User[];
  leaderId: string | null;
  cardOptions: 'fibonacci' | 'tshirt';
}
