import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module.js';
import { WsModule } from './ws/ws.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [RoomModule, WsModule, HealthModule],
})
export class AppModule {}
