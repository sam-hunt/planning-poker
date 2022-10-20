import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { WsModule } from './ws/ws.module';

@Module({
    imports: [RoomModule, WsModule],
})
export class AppModule { }
