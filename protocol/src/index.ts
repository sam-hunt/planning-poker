// Domain types
export { User } from './user.js';
export { Room } from './room.js';

// Message base types
export { RoomMessageBase } from './room-message-base.js';
export { RoomCommands, RoomEvents } from './room-messages.enum.js';

// Event message types
import { StateChangedEvent } from './events/state-changed.event.js';
export { StateChangedEvent };

// Command message types
import { ResetCardsCommand } from './commands/reset-cards.command.js';
export { ResetCardsCommand };
import { ResyncCommand } from './commands/resync.command.js';
export { ResyncCommand };
import { SetCardCommand } from './commands/set-card.js';
export { SetCardCommand };
import { SetRoomOptionsCommand } from './commands/set-room-options.command.js';
export { SetRoomOptionsCommand };
import { SetUserOptionsCommand } from './commands/set-user-options.command.js';
export { SetUserOptionsCommand };
import { ToggleCardVisibilityCommand } from './commands/toggle-card-visibility.command.js';
export { ToggleCardVisibilityCommand };

export type RoomMessage =
  | StateChangedEvent
  | ResetCardsCommand
  | ResyncCommand
  | SetCardCommand
  | SetRoomOptionsCommand
  | SetUserOptionsCommand
  | ToggleCardVisibilityCommand;
