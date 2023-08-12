import { RoomCommands } from '../room-messages.enum';
import { RoomMessageBase } from '../room-message-base';

export class SetUserIsSpectatingCommand extends RoomMessageBase {
    event: RoomCommands.SetUsername;
    isSpectating: boolean;
}
