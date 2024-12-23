import { RoomMessageBase } from '../room-message-base.js';
import { RoomCommands } from '../room-messages.enum.js';

export class SetCardCommand extends RoomMessageBase {
  event: RoomCommands.SetCard;
  card: string;
}
