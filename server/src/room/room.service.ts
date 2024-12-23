import { Injectable } from '@nestjs/common';
import { Room } from './room.js';
import { RoomMessage } from '@planning-poker/protocol';

@Injectable()
export class RoomService {
  public rooms = new Map<string, Room>();

  public handleConnection(userId: string, roomId: string): Room {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Room(roomId));
    const room = this.rooms.get(roomId)!;
    room.handleConnection(userId);
    return room;
  }

  public handleDisconnection(userId: string, roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    room.handleDisconnection(userId);
    if (room.users.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }
    return room;
  }

  public handleCommand(userId: string, roomId: string, message: RoomMessage): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    try {
      room.handleCommand(userId, message);
    } catch (e) {
      console.error(e);
    }
  }
}
