import type { RoomCommands } from '../room-messages.enum';
import type { RoomMessageBase } from '../room-message-base';

export interface ResetCardsCommand extends RoomMessageBase {
  event: RoomCommands.ResetCards;
}
