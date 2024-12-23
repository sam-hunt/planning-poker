import { RoomCommands } from '../room-messages.enum.js';
import { RoomMessageBase } from '../room-message-base.js';

export class SetUserOptionsCommand extends RoomMessageBase {
  event: RoomCommands.SetUserOptions;
  name: string;
  isSpectating: boolean;
}
