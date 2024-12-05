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

    constructor(public readonly id: string) {}

    public handleConnection(userId: string): void {
        this.users.push({ id: userId, name: null, card: null, isSpectating: false });
        if (this.users.length === 1) {
            this.isRevealed = false;
            this.lastResetAt = new Date().toISOString();
        }
    }

    public handleDisconnection(userId: string): void {
        const userIndex = this.users.findIndex(u => u.id === userId);
        this.users.splice(userIndex, 1);
        this.checkShouldReveal();
    }

    public handleCommand(userId: string, message: RoomMessageBase): void {
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
                this.users.find(u => u.id === userId).card = command.card;
                this.checkShouldReveal();
                break;
            }
            case RoomCommands.ToggleCardVisibility: {
                this.isRevealed = !this.isRevealed;
                break;
            }
            case RoomCommands.ResetCards: {
                this.isRevealed = false;
                this.lastResetAt = new Date().toISOString();
                this.users.forEach(u => void (u.card = null));
                this.isFirstReveal = true;
                break;
            }
        }
    }

    /**
     * Reveal all cards when everyone has picked for the first time after each reset
     **/
    private checkShouldReveal() {
        const participants = this.users.filter(u => !u.isSpectating);
        const cardsPickedCount = participants.reduce((acc, u) => (acc += u.card !== null ? 1 : 0), 0);
        if (this.isFirstReveal && !this.isRevealed && cardsPickedCount === participants.length) {
            this.isRevealed = true;
            this.isFirstReveal = false;
        }
    }
}
