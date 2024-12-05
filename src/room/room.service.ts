import { Injectable } from '@nestjs/common';
import { Room } from './room';
import { RoomMessageBase } from './messages/room-message-base';

@Injectable()
export class RoomService {
    constructor() {}

    public rooms: Map<string, Room> = new Map();

    public handleConnection(userId: string, roomId: string): void {
        if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Room(roomId));
        this.rooms.get(roomId).handleConnection(userId);
    }
    public handleDisconnection(userId: string, roomId: string): void {
        const room = this.rooms.get(roomId);
        room.handleDisconnection(userId);
        if (room.users.length === 0) this.rooms.delete(roomId);
    }
    public handleCommand(userId: string, roomId: string, message: RoomMessageBase): void {
        this.rooms.get(roomId).handleCommand(userId, message);
    }
}
