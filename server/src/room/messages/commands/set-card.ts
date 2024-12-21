import { RoomMessageBase } from '../room-message-base';
import { RoomCommands } from '../room-messages.enum';

export class SetCardCommand extends RoomMessageBase {
    event: RoomCommands.SetCard;
    card: string;
}
