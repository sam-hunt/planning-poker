import type { RoomCommands } from '../room-messages.enum';
import type { RoomMessageBase } from '../room-message-base';

export interface SetUserOptionsCommand extends RoomMessageBase {
    event: RoomCommands.SetUserOptions;
    name: string;
    isSpectating: boolean;
}
