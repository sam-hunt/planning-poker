import { Module } from '@nestjs/common';
import { RoomModule } from '../room/room.module';
import { WsGateway } from './ws.gateway';

@Module({
    imports: [RoomModule],
    providers: [WsGateway],
})
export class WsModule { }
