import { RoomCommands, RoomMessage, Room as RoomType, User } from '@planning-poker/protocol';

export class Room implements RoomType {
  public isRevealed = false;
  public lastResetAt = new Date().toISOString();
  public users: User[] = [];
  public isFirstReveal = true;
  public leaderId: string | null = null;
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

  public handleCommand(userId: string, command: RoomMessage): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;
    switch (command.event) {
      case RoomCommands.SetUserOptions: {
        user.name = command.name.slice(0, 24);
        user.isSpectating = command.isSpectating;
        if (user.isSpectating) {
          user.card = null;
          this.checkShouldReveal();
        }
        break;
      }
      case RoomCommands.SetCard: {
        user.card = command.card;
        this.checkShouldReveal();
        break;
      }
      case RoomCommands.SetRoomOptions: {
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
