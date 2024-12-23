import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { AppModule } from './app.module.js';

async function bootstrap() {
  config();
  const port = parseInt(process.env.PORT ?? '3000', 10);
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();

  await app.listen(port);
  new Logger('Main').log(`Planning Poker API running on port ${port.toString()}`);
}

void bootstrap();
