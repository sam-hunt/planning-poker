import { v4 as uuid } from 'uuid';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as WsServer, WebSocket } from 'ws';
import { RoomMessageBase } from '../room/messages/room-message-base';
import { Room } from '../room/room';
import { StateChangedEvent } from '../room/messages/events/state-changed.event';
import { RoomEvents } from '../room/messages/room-messages.enum';

@WebSocketGateway({ path: '/ws' })
export class WsGateway implements OnGatewayConnection {
    @WebSocketServer()
    private wsServer: WsServer;

    public constructor(private readonly room: Room) { }

    private sendToAll(message: RoomMessageBase) {
        this.wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message), { binary: false });
            }
        });
    }

    public handleConnection(client: WebSocket) {
        const userId = uuid();
        this.room.handleConnection(userId);

        client.on('message', (data, isBinary) => {
            if (isBinary) return;
            const message: RoomMessageBase = JSON.parse(data.toString('utf8'));
            this.room.handleCommand(userId, message);
            const ts = new Date().toISOString();
            const stateChangedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, room: this.room, ts };
            this.sendToAll(stateChangedEvent);
        });
        client.on('close', () => {
            this.room.handleDisconnection(userId);
            const ts = new Date().toISOString();
            const userDisconnectedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, room: this.room, ts };
            this.sendToAll(userDisconnectedEvent);
        })

        const userConnectedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, room: this.room, ts: new Date().toISOString() };
        this.sendToAll(userConnectedEvent);
    }
}
