import { User } from './user.js';

export class Room {
  isRevealed: boolean;
  lastResetAt: string;
  users: User[];
  leaderId: string | null;
  cardOptions: 'fibonacci' | 'tshirt';
}
