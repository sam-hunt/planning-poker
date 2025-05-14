import { RoomCommands, RoomMessage } from '@planning-poker/protocol';
import { Room } from './room.js';

describe('Room', () => {
  let room: Room;
  const ROOM_ID = 'test-room';
  const TEST_TS = '2024-01-01T00:00:00.000Z';

  beforeEach(() => {
    room = new Room(ROOM_ID);
  });

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      expect(room.id).toBe(ROOM_ID);
      expect(room.isRevealed).toBe(false);
      expect(room.users).toEqual([]);
      expect(room.isFirstReveal).toBe(true);
      expect(room.leaderId).toBeNull();
      expect(room.cardOptions).toBe('fibonacci');
    });
  });

  describe('handleConnection', () => {
    it('should add a new user with default values', () => {
      room.handleConnection('user1');
      expect(room.users).toHaveLength(1);
      expect(room.users[0]).toEqual({
        id: 'user1',
        name: null,
        card: null,
        isSpectating: false,
      });
    });

    it('should reset room state when first user connects', () => {
      const initialDate = new Date('2024-01-01').toISOString();
      room.lastResetAt = initialDate;
      room.isRevealed = true;

      room.handleConnection('user1');

      expect(room.isRevealed).toBe(false);
      expect(room.lastResetAt).not.toBe(initialDate);
    });
  });

  describe('handleDisconnection', () => {
    beforeEach(() => {
      room.handleConnection('user1');
      room.handleConnection('user2');
    });

    it('should remove the disconnected user', () => {
      room.handleDisconnection('user1');
      expect(room.users).toHaveLength(1);
      expect(room.users[0].id).toBe('user2');
    });

    it('should clear leaderId if leader disconnects', () => {
      room.handleCommand('user1', {
        event: RoomCommands.SetRoomOptions,
        leaderId: 'user1',
        cardOptions: 'fibonacci',
        ts: TEST_TS,
      });
      expect(room.leaderId).toBe('user1');

      room.handleDisconnection('user1');
      expect(room.leaderId).toBeNull();
    });

    it('should trigger auto-reveal when all remaining users have picked cards', () => {
      // Set up three users, all with cards
      room.handleConnection('user3');
      room.handleCommand('user1', {
        event: RoomCommands.SetCard,
        card: '5',
        ts: TEST_TS,
      });
      room.handleCommand('user2', {
        event: RoomCommands.SetCard,
        card: '8',
        ts: TEST_TS,
      });
      room.handleCommand('user3', {
        event: RoomCommands.SetCard,
        card: '13',
        ts: TEST_TS,
      });

      // Disconnect one user
      room.handleDisconnection('user2');

      // Should still be revealed since all remaining users have cards
      expect(room.isRevealed).toBe(true);
    });

    it('should not trigger auto-reveal if remaining users have not all picked cards', () => {
      // Set up three users, but only two have cards
      room.handleConnection('user3');
      room.handleCommand('user1', {
        event: RoomCommands.SetCard,
        card: '5',
        ts: TEST_TS,
      });
      room.handleCommand('user2', {
        event: RoomCommands.SetCard,
        card: '8',
        ts: TEST_TS,
      });
      // user3 hasn't picked a card

      // Disconnect one user with a card
      room.handleDisconnection('user1');

      // Should not be revealed since not all remaining users have cards
      expect(room.isRevealed).toBe(false);
    });
  });

  describe('handleCommand', () => {
    beforeEach(() => {
      room.handleConnection('user1');
    });

    describe('SetUserOptions', () => {
      it('should update user name and spectating status', () => {
        const command: RoomMessage = {
          event: RoomCommands.SetUserOptions,
          name: 'Test User',
          isSpectating: true,
          ts: TEST_TS,
        };

        room.handleCommand('user1', command);

        expect(room.users[0].name).toBe('Test User');
        expect(room.users[0].isSpectating).toBe(true);
      });

      it('should truncate name to 24 characters', () => {
        const longName = 'A'.repeat(30);
        room.handleCommand('user1', {
          event: RoomCommands.SetUserOptions,
          name: longName,
          isSpectating: false,
          ts: TEST_TS,
        });

        expect(room.users[0].name).toBe('A'.repeat(24));
      });

      it('should null user card when becoming a spectator', () => {
        // First set a card
        room.handleCommand('user1', {
          event: RoomCommands.SetCard,
          card: '5',
          ts: TEST_TS,
        });
        expect(room.users[0].card).toBe('5');

        // Then become a spectator
        room.handleCommand('user1', {
          event: RoomCommands.SetUserOptions,
          name: 'Spectator',
          isSpectating: true,
          ts: TEST_TS,
        });

        // Card should be nulled
        expect(room.users[0].card).toBeNull();
      });

      it('should trigger auto-reveal when becoming spectator makes all remaining participants have cards', () => {
        // Set up two users
        room.handleConnection('user2');

        // First user picks a card
        room.handleCommand('user1', {
          event: RoomCommands.SetCard,
          card: '5',
          ts: TEST_TS,
        });

        // Second user hasn't picked a card yet
        expect(room.isRevealed).toBe(false);

        // Second user becomes a spectator
        room.handleCommand('user2', {
          event: RoomCommands.SetUserOptions,
          name: 'Spectator',
          isSpectating: true,
          ts: TEST_TS,
        });

        // Should auto-reveal since all remaining participants (just user1) have cards
        expect(room.isRevealed).toBe(true);
        expect(room.isFirstReveal).toBe(false);
      });
    });

    describe('SetCard', () => {
      it('should set user card', () => {
        room.handleCommand('user1', {
          event: RoomCommands.SetCard,
          card: '5',
          ts: TEST_TS,
        });

        expect(room.users[0].card).toBe('5');
      });

      it('should auto-reveal when all participants have picked cards', () => {
        room.handleConnection('user2');

        room.handleCommand('user1', {
          event: RoomCommands.SetCard,
          card: '5',
          ts: TEST_TS,
        });
        room.handleCommand('user2', {
          event: RoomCommands.SetCard,
          card: '8',
          ts: TEST_TS,
        });

        expect(room.isRevealed).toBe(true);
        expect(room.isFirstReveal).toBe(false);
      });
    });

    describe('SetRoomOptions', () => {
      it('should update card options and leader', () => {
        room.handleCommand('user1', {
          event: RoomCommands.SetRoomOptions,
          cardOptions: 'tshirt',
          leaderId: 'user1',
          ts: TEST_TS,
        });

        expect(room.cardOptions).toBe('tshirt');
        expect(room.leaderId).toBe('user1');
      });

      it('should reset cards when card options change', () => {
        room.handleCommand('user1', {
          event: RoomCommands.SetCard,
          card: '5',
          ts: TEST_TS,
        });

        room.handleCommand('user1', {
          event: RoomCommands.SetRoomOptions,
          cardOptions: 'tshirt',
          leaderId: 'user1',
          ts: TEST_TS,
        });

        expect(room.users[0].card).toBeNull();
        expect(room.isRevealed).toBe(false);
      });
    });

    describe('ToggleCardVisibility', () => {
      it('should toggle isRevealed state', () => {
        expect(room.isRevealed).toBe(false);

        room.handleCommand('user1', {
          event: RoomCommands.ToggleCardVisibility,
          ts: TEST_TS,
        });

        expect(room.isRevealed).toBe(true);

        room.handleCommand('user1', {
          event: RoomCommands.ToggleCardVisibility,
          ts: TEST_TS,
        });

        expect(room.isRevealed).toBe(false);
      });
    });

    describe('ResetCards', () => {
      it('should reset all cards and room state', () => {
        room.handleCommand('user1', {
          event: RoomCommands.SetCard,
          card: '5',
          ts: TEST_TS,
        });

        room.handleCommand('user1', {
          event: RoomCommands.ResetCards,
          ts: TEST_TS,
        });

        expect(room.users[0].card).toBeNull();
        expect(room.isRevealed).toBe(false);
        expect(room.isFirstReveal).toBe(true);
      });
    });
  });
});
