import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { ReportRepository } from './repositories/reports.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtStrtegy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { Community } from 'src/entities/community.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CommentRepositoty } from 'src/comments/repositories/comment.repository';
import { CommunityRepository } from 'src/communites/repositories/community.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Report, User, Comment, Community]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportRepository,
    UserRepository,
    CommentRepositoty,
    CommunityRepository,
    JwtService,
    JwtStrtegy,
  ],
})
export class ReportsModule {}
