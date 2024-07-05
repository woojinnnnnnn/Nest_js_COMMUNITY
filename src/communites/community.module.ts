import { Module } from '@nestjs/common';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CommunityRepository } from './repositories/community.repository';
import { AccessTokenStrategy } from 'src/auth/jwt/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/auth/jwt/refreshToken.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community, User]), AuthModule, JwtModule],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [CommunityService, CommunityRepository],
})
export class CommunityModule {}


