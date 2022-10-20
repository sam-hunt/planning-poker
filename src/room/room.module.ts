import { Module } from '@nestjs/common';
import { Room } from './room';

@Module({
    imports: [],
    providers: [Room],
    exports: [Room],
})
export class RoomModule { }
