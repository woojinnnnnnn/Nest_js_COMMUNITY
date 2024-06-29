import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/utils/winston.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger
  });
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
