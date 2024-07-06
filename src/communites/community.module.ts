import { Module } from '@nestjs/common';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CommunityRepository } from './repositories/community.repository';
import { UsersModule } from 'src/users/user.module';
import { JwtStrtegy } from 'src/auth/jwt/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Community, User]),
    UsersModule,
    JwtModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository, JwtService, JwtStrtegy],
  exports: [CommunityService, CommunityRepository],
})
export class CommunityModule {}
