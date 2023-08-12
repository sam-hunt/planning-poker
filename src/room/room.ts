import { SetCardCommand } from './messages/commands/set-card';
import { SetUserIsSpectatingCommand } from './messages/commands/set-user-is-spectating.command';
import { SetUsernameCommand } from './messages/commands/set-username.command';
import { RoomMessageBase } from './messages/room-message-base';
import { RoomCommands } from './messages/room-messages.enum';
import { User } from './user';

export class Room {
    public isRevealed = false;
    public lastResetAt = new Date().toISOString();
    public users: User[] = [];
    public isFirstReveal = true;

    public handleConnection(userId: string) {
        this.users.push({ id: userId, name: null, card: null, isSpectating: false });
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
            // TODO: Refactor SetUsername and SetUserIsSpectating to combined SetUserDetails
            case RoomCommands.SetUsername: {
                const command = message as SetUsernameCommand;
                this.users.find(u => u.id === userId).name = command.username.slice(0, 16);
                break;
            }
            case RoomCommands.SetUserIsSpectating: {
                const command = message as SetUserIsSpectatingCommand;
                this.users.find(u => u.id === userId).isSpectating = command.isSpectating;
                break;
            }
            case RoomCommands.SetCard: {
                const command = message as SetCardCommand;
                const participants = this.users.filter(u => !u.isSpectating);
                participants.find(u => u.id === userId).card = command.card;

                // Reveal all cards when everyone has picked for the first time after each reset
                const cardsPickedCount = participants.reduce((acc, u) => acc += u.card !== null ? 1 : 0, 0);
                if (this.isFirstReveal && !this.isRevealed && cardsPickedCount === participants.length) {
                    this.isRevealed = true;
                    this.isFirstReveal = false;
                }
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
                this.isFirstReveal = true;
                break;
            }
        }
    }
}
