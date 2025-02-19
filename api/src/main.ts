import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import logger from './helpers/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
