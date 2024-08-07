import { Module } from '@nestjs/common';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';
import { Board } from 'src/entities/board.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/user.module';
import { BoardModule } from 'src/boards/board.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LikeRepository } from './repositories/likes.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Like, Board, User]),
    UsersModule,
    BoardModule,
    JwtModule,
  ],
  controllers: [LikesController],
  providers: [LikesService, LikeRepository, JwtService, JwtService],
})
export class LikesModule {}
