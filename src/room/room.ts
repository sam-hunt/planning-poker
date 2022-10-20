import { SetCardCommand } from './messages/commands/set-card';
import { SetUsernameCommand } from './messages/commands/set-username.command';
import { RoomMessageBase } from './messages/room-message-base';
import { RoomCommands } from './messages/room-messages.enum';
import { User } from './user';

export class Room {
    public isRevealed = false;
    public lastResetAt = new Date().toISOString();
    public users: User[] = [];

    public handleConnection(userId: string) {
        this.users.push({ id: userId, name: null, card: null });
        if (this.users.length === 1) {
            this.isRevealed = false;
            this.lastResetAt = new Date().toISOString();
        }
    }

    public handleDisconnection(userId: string) {
        this.users.splice(this.users.findIndex(u => u.id === userId), 1);
    }

    public handleCommand(userId: string, message: RoomMessageBase) {
        switch (message.event) {
            case RoomCommands.SetUsername: {
                const command = message as SetUsernameCommand;
                this.users.find(u => u.id === userId).name = command.username;
                break;
            }
            case RoomCommands.SetCard: {
                const command = message as SetCardCommand;
                this.users.find(u => u.id === userId).card = command.card;
                break;
            }
            case RoomCommands.ToggleCardVisibility: {
                this.isRevealed = !this.isRevealed;
                break;
            }
            case RoomCommands.ResetCards: {
                this.isRevealed = false;
                this.lastResetAt = new Date().toISOString();
                this.users.forEach(u => u.card = null);
                break;
            }
        }
    }
}
