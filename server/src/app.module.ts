import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module.js';
import { WsModule } from './ws/ws.module.js';

@Module({
  imports: [RoomModule, WsModule],
})
export class AppModule {}
