import { Module } from '@nestjs/common';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CommunityRepository } from './repositories/community.repository';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Community, User]),
    UsersModule,
    JwtModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository],
  exports: [CommunityService, CommunityRepository],
})
export class CommunityModule {}
