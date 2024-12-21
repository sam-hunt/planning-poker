import { RoomCommands } from '../room-messages.enum';
import { RoomMessageBase } from '../room-message-base';

export class ToggleCardVisibilityCommand extends RoomMessageBase {
    event: RoomCommands.ToggleCardVisibility;
}
