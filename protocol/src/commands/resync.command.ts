import { RoomMessageBase } from '../room-message-base.js';
import { RoomCommands } from '../room-messages.enum.js';

export class ResyncCommand extends RoomMessageBase {
  event: RoomCommands.Resync;
}
