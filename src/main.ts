import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    config();
    const port = parseInt(process.env.PORT || '3000', 10);
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    app.enableCors();

    await app.listen(port);
    new Logger('Main').log(`Planning Poker API running on port ${port}`);
}
bootstrap();
