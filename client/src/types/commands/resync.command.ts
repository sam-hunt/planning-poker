import type { RoomMessageBase } from '../room-message-base';
import type { RoomCommands } from '../room-messages.enum';

export interface ResyncCommand extends RoomMessageBase {
  event: RoomCommands.Resync;
}
