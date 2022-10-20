import { RoomCommands } from '../room-messages.enum';
import { RoomMessageBase } from '../room-message-base';

export class ResetCardsCommand extends RoomMessageBase {
    event: RoomCommands.ResetCards;
}
