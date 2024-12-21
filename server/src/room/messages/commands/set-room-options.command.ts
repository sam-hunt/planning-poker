import { RoomMessageBase } from '../room-message-base';
import { RoomCommands } from '../room-messages.enum';

export class SetRoomOptionsCommand extends RoomMessageBase {
    event: RoomCommands.SetRoomOptions;
    leaderId: string | null;
    cardOptions: 'fibonacci' | 'tshirt';
}
