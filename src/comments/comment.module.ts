import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { CommentRepositoty } from './repositories/comment.repository';
import { UsersModule } from 'src/users/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrtegy } from 'src/auth/jwt/jwt.strategy';
import { Board } from 'src/entities/board.entity';
import { BoardModule } from 'src/boards/board.module';
import { UserRepository } from 'src/users/repositories/user.repository';
import { BoardRepository } from 'src/boards/repositories/board.repository';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Comment, Board, User]),
    UsersModule,
    BoardModule,
    JwtModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepositoty,
    UserRepository,
    BoardRepository,
    JwtStrtegy,
    JwtService,
  ],
  exports: [CommentRepositoty],
})
export class CommentModule {}
