import { SetCardCommand } from './messages/commands/set-card';
import { SetRoomOptionsCommand } from './messages/commands/set-room-options.command';
import { SetUserOptionsCommand } from './messages/commands/set-user-options.command';
import { RoomMessageBase } from './messages/room-message-base';
import { RoomCommands } from './messages/room-messages.enum';
import { User } from './user';

export class Room {
    public isRevealed = false;
    public lastResetAt = new Date().toISOString();
    public users: User[] = [];
    public isFirstReveal = true;
    public leaderId: string = null;
    public cardOptions: 'fibonacci' | 'tshirt' = 'fibonacci';

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
        if (this.leaderId === userId) this.leaderId = null;
    }

    public handleCommand(userId: string, message: RoomMessageBase): void {
        switch (message.event) {
            case RoomCommands.SetUserOptions: {
                const command = message as SetUserOptionsCommand;
                const user = this.users.find(u => u.id === userId);
                user.name = command.name.slice(0, 24);
                user.isSpectating = command.isSpectating;
                break;
            }
            case RoomCommands.SetCard: {
                const command = message as SetCardCommand;
                this.users.find(u => u.id === userId).card = command.card;
                this.checkShouldReveal();
                break;
            }
            case RoomCommands.SetRoomOptions: {
                const command = message as SetRoomOptionsCommand;
                if (this.cardOptions !== command.cardOptions) this.resetCards();
                this.cardOptions = command.cardOptions;
                this.leaderId = command.leaderId;
                break;
            }
            case RoomCommands.ToggleCardVisibility: {
                this.isRevealed = !this.isRevealed;
                break;
            }
            case RoomCommands.ResetCards: {
                this.resetCards();
                break;
            }
        }
    }

    private resetCards(): void {
        this.isRevealed = false;
        this.lastResetAt = new Date().toISOString();
        this.users.forEach(u => void (u.card = null));
        this.isFirstReveal = true;
    }

    /**
     * Reveal all cards when everyone has picked for the first time after each reset
     **/
    private checkShouldReveal(): void {
        const participants = this.users.filter(u => !u.isSpectating);
        const cardsPickedCount = participants.reduce((acc, u) => (acc += u.card !== null ? 1 : 0), 0);
        if (this.isFirstReveal && !this.isRevealed && cardsPickedCount === participants.length) {
            this.isRevealed = true;
            this.isFirstReveal = false;
        }
    }
}
