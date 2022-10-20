import type { Room } from '../room';
import type { RoomMessageBase } from '../room-message-base';
import type { RoomEvents } from '../room-messages.enum';

export interface StateChangedEvent extends RoomMessageBase {
  event: RoomEvents.StateChanged;
  room: Room;
}
