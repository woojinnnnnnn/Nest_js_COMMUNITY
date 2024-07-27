import { Module } from '@nestjs/common';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/user.module';
import { CommunityModule } from 'src/communites/community.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LikeRepository } from './repositories/likes.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Like, Community, User]),
    UsersModule,
    CommunityModule,
    JwtModule,
  ],
  controllers: [LikesController],
  providers: [LikesService, LikeRepository, JwtService, JwtService],
})
export class LikesModule {}
