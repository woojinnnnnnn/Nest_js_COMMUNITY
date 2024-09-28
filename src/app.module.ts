import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './boards/board.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Board } from './entities/board.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Report } from './entities/report.entity';
import { CommentModule } from './comments/comment.module';
import { LikesModule } from './likes/likes.module';
import { ReportsModule } from './reports/reports.module';
import { EmailService } from './email/email.service';
import { Notification } from './entities/notification';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Board, Comment, Like, Report, Notification],
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
      charset: 'utf8mb4',
    }),
    BoardModule,
    UsersModule,
    AuthModule,
    CommentModule,
    LikesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
