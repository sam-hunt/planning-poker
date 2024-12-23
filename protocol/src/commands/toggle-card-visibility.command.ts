import { RoomCommands } from '../room-messages.enum.js';
import { RoomMessageBase } from '../room-message-base.js';

export class ToggleCardVisibilityCommand extends RoomMessageBase {
  event: RoomCommands.ToggleCardVisibility;
}
