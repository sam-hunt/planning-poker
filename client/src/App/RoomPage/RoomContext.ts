import { createContext } from 'react';
import { UserOptions } from './RoomProvider';
import { ReadyState } from 'react-use-websocket';
import { Room, RoomMessageBase } from '@planning-poker/protocol';

export interface RoomContextType {
  room: Room | null;
  userId: string | null;
  userOptions: UserOptions;
  sendCommand: (command: RoomMessageBase) => void;
  readyState: ReadyState;
}

// This value will be set by the provider before it is accessed
export const RoomContext = createContext<RoomContextType>(null!);
