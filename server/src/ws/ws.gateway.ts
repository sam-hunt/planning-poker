import { v4 as uuid } from 'uuid';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { URLSearchParams } from 'url';
import { RoomService } from '../room/room.service.js';
import { Room } from '../room/room.js';
import { RoomEvents, RoomMessage, StateChangedEvent, User } from '@planning-poker/protocol';

@WebSocketGateway({ path: '/ws' })
export class WsGateway implements OnGatewayConnection {
  private roomClientsByRoomId = new Map<Room['id'], Set<WebSocket>>();
  private roomUserIdsByClient = new Map<WebSocket, User['id']>();

  public constructor(private readonly roomService: RoomService) {}

  // TODO: Wrap send function in closure and pass to room to control message flow ?
  private broadcastRoomState(room: Room) {
    const ts = new Date().toISOString();
    const roomClients = this.roomClientsByRoomId.get(room.id);
    if (!roomClients) return;

    for (const client of roomClients) {
      const userId = this.roomUserIdsByClient.get(client);
      if (!userId || client.readyState !== WebSocket.OPEN) continue;
      const stateChangedEvent: StateChangedEvent = { event: RoomEvents.StateChanged, userId, room, ts };
      client.send(JSON.stringify(stateChangedEvent), { binary: false });
    }
  }

  public handleConnection(client: WebSocket, connection: { url: string }) {
    const { url } = connection;
    if (!url.includes('?')) {
      client.close(1008, 'Connection requires a roomId url parameter');
      return;
    }
    const roomId = new URLSearchParams(url.split('?')[1]).get('roomId');
    if (!roomId) {
      client.close(1008, 'Connection requires a roomId url parameter');
      return;
    }

    const userId = uuid();
    const room = this.roomService.handleConnection(userId, roomId);
    const roomClients = this.roomClientsByRoomId.get(roomId) ?? new Set();
    roomClients.add(client);
    this.roomClientsByRoomId.set(roomId, roomClients);
    this.roomUserIdsByClient.set(client, userId);

    client.on('message', (data, isBinary) => {
      if (isBinary) {
        client.close(1003, 'Message must be JSON');
        return;
      }
      // TODO: Add some better type safety and validation around incoming messages
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const message = JSON.parse(data.toString('utf-8')) as RoomMessage;
      this.roomService.handleCommand(userId, roomId, message);
      this.broadcastRoomState(room);
    });

    client.on('close', () => {
      this.roomService.handleDisconnection(userId, roomId);
      const roomClients = this.roomClientsByRoomId.get(roomId);
      if (roomClients) roomClients.delete(client);
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
