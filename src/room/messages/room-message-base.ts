import { RoomCommands, RoomEvents } from './room-messages.enum';

export class RoomMessageBase {
    event: RoomCommands | RoomEvents;
    ts: string;
    [key: string]: unknown;
}
