import { Module } from '@nestjs/common';
import { RoomService } from './room.service.js';

@Module({
  imports: [],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
