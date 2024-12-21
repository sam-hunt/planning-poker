import type { RoomMessageBase } from '../room-message-base';
import type { RoomCommands } from '../room-messages.enum';

export interface SetCardCommand extends RoomMessageBase {
  event: RoomCommands.SetCard;
  card: string;
}
