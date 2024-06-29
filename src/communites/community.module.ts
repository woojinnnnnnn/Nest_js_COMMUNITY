import { Module } from '@nestjs/common';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';

@Module({
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
