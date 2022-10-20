import type { RoomCommands } from '../room-messages.enum';
import type { RoomMessageBase } from '../room-message-base';

export interface SetUsernameCommand extends RoomMessageBase {
  event: RoomCommands.SetUsername;
  username: string;
}
