import type { RoomCommands } from '../room-messages.enum';
import type { RoomMessageBase } from '../room-message-base';

export interface ToggleCardVisibilityCommand extends RoomMessageBase {
  event: RoomCommands.ToggleCardVisibility;
}
