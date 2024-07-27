import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunityModule } from './communites/community.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Report } from './entities/report.entity';
import { CommunityController } from './communites/controllers/community.controller';
import { CommunityService } from './communites/services/community.service';
import { CommentModule } from './comments/comment.module';
import { LikesModule } from './likes/likes.module';
import { ReportsModule } from './reports/reports.module';

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
      entities: [User, Community, Comment, Like, Report],
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
      charset: 'utf8mb4',
    }),
    CommunityModule,
    UsersModule,
    AuthModule,
    CommentModule,
    LikesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
