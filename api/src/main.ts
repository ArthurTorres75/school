import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './helpers/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
