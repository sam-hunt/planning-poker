import { v4 as uuid } from 'uuid';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { RoomMessageBase } from '../room/messages/room-message-base';
import { StateChangedEvent } from '../room/messages/events/state-changed.event';
import { RoomEvents } from '../room/messages/room-messages.enum';
import { URLSearchParams } from 'url';
import { RoomService } from '../room/room.service';
import { Room } from '../room/room';
import { User } from '../room/user';

@WebSocketGateway({ path: '/ws' })
export class WsGateway implements OnGatewayConnection {
    private roomClientsByRoomId: Map<Room['id'], Set<WebSocket>> = new Map();
    private roomUserIdsByClient: Map<WebSocket, User['id']> = new Map();

    public constructor(private readonly roomService: RoomService) {}

    // TODO: Wrap send function in closure and pass to room to control message flow ?
    private broadcastRoomState(room: Room) {
        const ts = new Date().toISOString();
        this.roomClientsByRoomId.get(room.id).forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const userId = this.roomUserIdsByClient.get(client);
                const stateChangedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, userId, room, ts };
                client.send(JSON.stringify(stateChangedEvent), { binary: false });
            }
        });
    }

    public handleConnection(client: WebSocket, connection: { url: string }) {
        const { url } = connection;
        if (!url.includes('?')) client.close();
        const roomId = new URLSearchParams(url.split('?')[1]).get('roomId');
        if (!roomId) client.close();

        const userId = uuid();
        this.roomService.handleConnection(userId, roomId);
        const room = this.roomService.rooms.get(roomId);
        const roomClients = this.roomClientsByRoomId.get(roomId) ?? new Set();
        roomClients.add(client);
        this.roomClientsByRoomId.set(roomId, roomClients);
        this.roomUserIdsByClient.set(client, userId);

        client.on('message', (data, isBinary) => {
            if (isBinary) return;
            const message: RoomMessageBase = JSON.parse(data.toString('utf-8'));
            this.roomService.handleCommand(userId, roomId, message);

            this.broadcastRoomState(room);
        });
        client.on('close', () => {
            this.roomService.handleDisconnection(userId, roomId);
            this.roomClientsByRoomId.get(roomId).delete(client);
            this.roomUserIdsByClient.delete(client);
            if (room.users.length === 0) {
                this.roomClientsByRoomId.delete(roomId);
                return;
            }
            this.broadcastRoomState(room);
        });
        this.broadcastRoomState(room);
    }
}
