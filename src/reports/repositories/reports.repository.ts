import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';
import { ReportRequestDto } from '../dtos/report.request.dto';
import { User } from 'src/entities/user.entity';
import { Board } from 'src/entities/board.entity';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async findAllReport() {
    try {
      const reports = await this.reportRepository.find({
        relations: ['user', 'board', 'comment', 'reporter'],
      });
      return reports;
    } catch (error) {
      throw new HttpException('Server ERror', 500);
    }
  }

  async createUserReport(
    body: ReportRequestDto,
    reportedUser: User,
    reporter: User,
  ) {
    try {
      const { reason, tags } = body;
      const report = this.reportRepository.create({
        reason,
        tags,
        user: reportedUser,
        reporter: reporter,
      });

      return await this.reportRepository.save(report);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async createBoardReport(
    body: ReportRequestDto,
    reportedBoard: Board,
    reporter: User,
  ) {
    try {
      const { reason, tags } = body;
      const report = this.reportRepository.create({
        reason,
        tags,
        board: reportedBoard,
        reporter: reporter,
      });
      return await this.reportRepository.save(report);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async createCommentReport(
    body: ReportRequestDto,
    reportedComment: Comment,
    reporter: User,
  ) {
    try {
      const { reason, tags } = body;
      const report = this.reportRepository.create({
        reason,
        tags,
        comment: reportedComment,
        reporter: reporter,
      });
      return await this.reportRepository.save(report);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
