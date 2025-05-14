import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service.js';
import { Room } from './room.js';
import { RoomCommands, SetCardCommand } from '@planning-poker/protocol';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should create a new room if it does not exist', () => {
      const roomId = 'test-room';
      const userId = 'user-1';

      const room = service.handleConnection(userId, roomId);

      expect(room).toBeDefined();
      expect(room).toBeInstanceOf(Room);
      expect(service.rooms.has(roomId)).toBe(true);
    });

    it('should return existing room if it exists', () => {
      const roomId = 'test-room';
      const userId1 = 'user-1';
      const userId2 = 'user-2';

      const room1 = service.handleConnection(userId1, roomId);
      const room2 = service.handleConnection(userId2, roomId);

      expect(room1).toBe(room2);
      expect(service.rooms.size).toBe(1);
    });

    it('should add user to room with default values', () => {
      const roomId = 'test-room';
      const userId = 'user-1';

      const room = service.handleConnection(userId, roomId);

      expect(room.users).toHaveLength(1);
      expect(room.users[0]).toEqual({
        id: userId,
        name: null,
        card: null,
        isSpectating: false,
      });
    });
  });

  describe('handleDisconnection', () => {
    it('should remove user from room and return room if other users exist', () => {
      const roomId = 'test-room';
      const userId1 = 'user-1';
      const userId2 = 'user-2';

      service.handleConnection(userId1, roomId);
      service.handleConnection(userId2, roomId);

      const room = service.handleDisconnection(userId1, roomId);

      expect(room).toBeDefined();
      expect(service.rooms.has(roomId)).toBe(true);
    });

    it('should delete room and return null when last user disconnects', () => {
      const roomId = 'test-room';
      const userId = 'user-1';

      service.handleConnection(userId, roomId);
      const room = service.handleDisconnection(userId, roomId);

      expect(room).toBeNull();
      expect(service.rooms.has(roomId)).toBe(false);
    });

    it('should return null if room does not exist', () => {
      const room = service.handleDisconnection('user-1', 'non-existent-room');
      expect(room).toBeNull();
    });
  });

  describe('handleCommand', () => {
    it('should handle command for existing room', () => {
      const roomId = 'test-room';
      const userId = 'user-1';
      const message: SetCardCommand = {
        event: RoomCommands.SetCard,
        card: '5',
        ts: new Date().toISOString(),
      };

      service.handleConnection(userId, roomId);

      // Mock console.error to prevent error output during tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.handleCommand(userId, roomId, message);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it.todo('should throw an error when receiving an invalid room message');
  });
});
