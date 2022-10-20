import { RoomCommands } from '../room-messages.enum';
import { RoomMessageBase } from '../room-message-base';

export class SetUsernameCommand extends RoomMessageBase {
    event: RoomCommands.SetUsername;
    username: string;
}
