import { Room } from '../room.js';
import { RoomMessageBase } from '../room-message-base.js';
import { RoomEvents } from '../room-messages.enum.js';

export class StateChangedEvent extends RoomMessageBase {
  event: RoomEvents.StateChanged;
  userId: string;
  room: Room;
}
