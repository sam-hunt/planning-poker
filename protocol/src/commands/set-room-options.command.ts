import { RoomMessageBase } from '../room-message-base.js';
import { RoomCommands } from '../room-messages.enum.js';

export class SetRoomOptionsCommand extends RoomMessageBase {
  event: RoomCommands.SetRoomOptions;
  leaderId: string | null;
  cardOptions: 'fibonacci' | 'tshirt';
}
