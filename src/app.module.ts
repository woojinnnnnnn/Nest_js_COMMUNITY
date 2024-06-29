import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunityController } from './communites/controllers/community.controller';
import { CommunityService } from './communites/services/community.service';
import { CommunityModule } from './communites/community.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
      charset: 'utf8mb4',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    CommunityModule,
  ],
  controllers: [AppController, CommunityController],
  providers: [AppService, CommunityService],
})
export class AppModule {}
