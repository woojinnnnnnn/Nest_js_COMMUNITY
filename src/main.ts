import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/utils/winston.util';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  // HTTP 예외 처리 필터 -------------------------------------------------------
  app.useGlobalFilters(new HttpExceptionFilter());
  // try-catch 로 묶으니 위에서 걸리질 않음.. 
  // class-validation -------------------------------------------------------
  app.useGlobalPipes(new ValidationPipe( { transform: true } ));
  // CORS -------------------------------------------------------------------
  app.enableCors({ origin: 'http://localhost:3000', credentials: true }); // origin 부분에 특정 URL 작성.
  await app.listen(port);
  console.log(`---------- SERVER_START_ON_PORT ${port} ----------`);
}
bootstrap();
