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
import { Community } from 'src/entities/community.entity';
import { CommunityModule } from 'src/communites/community.module';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CommunityRepository } from 'src/communites/repositories/community.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Comment, Community, User]),
    UsersModule,
    CommunityModule,
    JwtModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepositoty, UserRepository, CommunityRepository, JwtStrtegy, JwtService],
  exports: [CommentRepositoty]
})
export class CommentModule {}
