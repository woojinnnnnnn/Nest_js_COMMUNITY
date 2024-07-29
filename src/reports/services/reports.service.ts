import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../repositories/reports.repository';
import { ReportRequestDto } from '../dtos/report.request.dto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CommunityRepository } from 'src/communites/repositories/community.repository';
import { CommentRepositoty } from 'src/comments/repositories/comment.repository';
import { User } from 'src/entities/user.entity';
import { ReportDTO } from '../dtos/report.response.dto';
import { UserDTO } from '../dtos/user.response.dto';
import { CommunityDTO } from '../dtos/community.response.dto';
import { CommentDTO } from '../dtos/comment.response.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly userRepository: UserRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly commentRepository: CommentRepositoty,
  ) {}

  async findAllReport(): Promise<ReportDTO[]> {
    try {
      const reports = await this.reportRepository.findAllReport()
      return reports.map(report => {
        const reportDto = new ReportDTO();
        reportDto.id = report.id;
        reportDto.reason = report.reason;
        reportDto.tags = report.tags;
  
        if (report.user) {
          const userDto = new UserDTO();
          userDto.id = report.user.id;
          userDto.email = report.user.email;
          userDto.nickName = report.user.nickName;
          userDto.role = report.user.role;
          reportDto.user = userDto;
        }
  
        if (report.community) {
          const communityDto = new CommunityDTO();
          communityDto.id = report.community.id;
          communityDto.title = report.community.title;
          communityDto.content = report.community.content;
          reportDto.community = communityDto;
        }
  
        if (report.comment) {
          const commentDto = new CommentDTO();
          commentDto.id = report.comment.id;
          commentDto.content = report.comment.content;
          reportDto.comment = commentDto;
        }
  
        if (report.reporter) {
          const reporterDto = new UserDTO();
          reporterDto.id = report.reporter.id;
          reporterDto.email = report.reporter.email;
          reporterDto.nickName = report.reporter.nickName;
          reporterDto.role = report.reporter.role;
          reportDto.reporter = reporterDto;
        }
  
        return reportDto;
      }); // 새 배열을 만들어 보기 쉽게끔 리턴. 해주는데 솔직히 잘 모르겠음..
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async createUserReport(
    body: ReportRequestDto,
    reportedUserId: number,
    reporter: User,
  ) {
    try {
      const reportedUser =
        await this.userRepository.findUserById(reportedUserId);
      if (!reportedUser) {
        throw new NotFoundException('User Not Found');
      }
      const report = await this.reportRepository.createUserReport(
        body,
        reportedUser,
        reporter,
      );
      return {
        id: report.id,
        reportedUser,
        reason: report.reason,
        tags: report.tags,
        reporter: report.reporter,
      };
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async createComuReport(
    body: ReportRequestDto,
    reportedComuId: number,
    reporter: User,
  ) {
    try {
      const reportedComu =
        await this.communityRepository.findOneComuId(reportedComuId);
      if (!reportedComu) {
        throw new NotFoundException('Comuunity nottr founddddd');
      }
      const report = await this.reportRepository.createComuReport(
        body,
        reportedComu,
        reporter,
      );
      return {
        id: report.id,
        reportedComu,
        reason: report.reason,
        tags: report.tags,
        reporter: report.reporter,
      };
    } catch (error) {
      throw new HttpException('server errror', 500);
    }
  }

  async createCommentReport(
    body: ReportRequestDto,
    reportedCommentId: number,
    reporter: User,
  ) {
    try {
      const reportedComment =
        await this.commentRepository.findOne(reportedCommentId);
      if (!reportedComment) {
        throw new NotFoundException('Comment not found');
      }
      const report = await this.reportRepository.createCommentReport(
        body,
        reportedComment,
        reporter,
      );
      return {
        id: report.id,
        reportedComment,
        reason: report.reason,
        tags: report.tags,
        reporter: report.reporter,
      };
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
