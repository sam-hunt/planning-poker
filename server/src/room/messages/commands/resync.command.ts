import { RoomMessageBase } from '../room-message-base';
import { RoomCommands } from '../room-messages.enum';

export class ResyncCommand extends RoomMessageBase {
    event: RoomCommands.Resync;
}
