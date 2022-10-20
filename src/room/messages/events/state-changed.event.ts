import { Room } from '../../room';
import { RoomMessageBase } from '../room-message-base';
import { RoomEvents } from '../room-messages.enum';

export class StateChangedEvent extends RoomMessageBase {
    event: RoomEvents.StateChanged;
    room: Room;
}
