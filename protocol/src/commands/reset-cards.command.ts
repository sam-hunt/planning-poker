import { RoomCommands } from '../room-messages.enum.js';
import { RoomMessageBase } from '../room-message-base.js';

export class ResetCardsCommand extends RoomMessageBase {
  event: RoomCommands.ResetCards;
}
