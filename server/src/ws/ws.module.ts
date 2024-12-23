import { Module } from '@nestjs/common';
import { RoomModule } from '../room/room.module.js';
import { WsGateway } from './ws.gateway.js';

@Module({
  imports: [RoomModule],
  providers: [WsGateway],
})
export class WsModule {}
