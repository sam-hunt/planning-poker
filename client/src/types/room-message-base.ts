import type { RoomCommands, RoomEvents } from './room-messages.enum';

export interface RoomMessageBase {
  event: RoomCommands | RoomEvents;
  ts: string;
  [key: string]: unknown;
}
