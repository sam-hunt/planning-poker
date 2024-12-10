import { createContext } from 'react';
import { Room } from '../../types/room';
import { RoomMessageBase } from '../../types/room-message-base';
import { UserOptions } from './RoomProvider';
import { ReadyState } from 'react-use-websocket';

export interface RoomContextType {
  room: Room | null;
  userId: string | null;
  userOptions: UserOptions;
  sendCommand: (command: RoomMessageBase) => void;
  readyState: ReadyState;
}

// This value will be set by the provider before it is accessed
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const RoomContext = createContext<RoomContextType>(null!);
