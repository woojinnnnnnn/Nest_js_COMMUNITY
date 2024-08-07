import { Module } from '@nestjs/common';
import { BoardController } from './controllers/board.controller';
import { BoardService } from './services/board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/entities/board.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BoardRepository } from './repositories/board.repository';
import { UsersModule } from 'src/users/user.module';
import { JwtStrtegy } from 'src/auth/jwt/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Board, User]),
    UsersModule,
    JwtModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, JwtService, JwtStrtegy],
  exports: [BoardService, BoardRepository],
})
export class BoardModule {}
