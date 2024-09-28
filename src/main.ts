import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/utils/winston.util';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'


async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }as Partial<admin.ServiceAccount>),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  })
  
  console.log(admin.SDK_VERSION,"app")
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
