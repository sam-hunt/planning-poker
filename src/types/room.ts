import type { User } from './user';

export interface Room {
  isRevealed: boolean;
  lastResetAt: string;
  users: User[];
}
