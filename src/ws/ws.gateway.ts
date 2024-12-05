import { v4 as uuid } from 'uuid';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { RoomMessageBase } from '../room/messages/room-message-base';
import { StateChangedEvent } from '../room/messages/events/state-changed.event';
import { RoomEvents } from '../room/messages/room-messages.enum';
import { URLSearchParams } from 'url';
import { RoomService } from '../room/room.service';
import { Room } from '../room/room';

@WebSocketGateway({ path: '/ws' })
export class WsGateway implements OnGatewayConnection {
    private roomClients: Map<Room['id'], Set<WebSocket>> = new Map();

    public constructor(private readonly roomService: RoomService) {}

    // TODO: Wrap send function in closure and pass to room to control message flow ?
    private sendToRoom(roomId: Room['id'], message: RoomMessageBase) {
        this.roomClients.get(roomId).forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message), { binary: false });
            }
        });
    }

    public handleConnection(client: WebSocket, connection: { url: string }) {
        const { url } = connection;
        if (!url.includes('?')) client.close();
        const roomId = new URLSearchParams(url.split('?')[1]).get('roomId');
        if (!roomId) client.close();

        const roomClients = this.roomClients.get(roomId) ?? new Set();
        roomClients.add(client);
        this.roomClients.set(roomId, roomClients);

        const userId = uuid();
        this.roomService.handleConnection(userId, roomId);
        const room = this.roomService.rooms.get(roomId);

        client.on('message', (data, isBinary) => {
            if (isBinary) return;
            const message: RoomMessageBase = JSON.parse(data.toString('utf-8'));
            this.roomService.handleCommand(userId, roomId, message);
            const ts = new Date().toISOString();
            const stateChangedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, room, ts };
            this.sendToRoom(roomId, stateChangedEvent);
        });
        client.on('close', () => {
            this.roomService.handleDisconnection(userId, roomId);
            this.roomClients.get(roomId).delete(client);
            if (room.users.length === 0) {
                this.roomClients.delete(roomId);
                return;
            }
            const ts = new Date().toISOString();
            const userDisconnectedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, room, ts };
            this.sendToRoom(roomId, userDisconnectedEvent);
        });

        const userConnectedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, room, ts: new Date().toISOString() };
        this.sendToRoom(roomId, userConnectedEvent);
    }
}
