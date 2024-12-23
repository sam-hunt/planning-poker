import type { RoomCommands, RoomEvents } from './room-messages.enum.js';

export abstract class RoomMessageBase {
  abstract event: RoomCommands | RoomEvents;
  ts: string;
  [key: string]: unknown;
}
