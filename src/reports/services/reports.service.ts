import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../repositories/reports.repository';
import { ReportRequestDto } from '../dtos/report.request.dto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { BoardRepository } from 'src/boards/repositories/board.repository';
import { CommentRepositoty } from 'src/comments/repositories/comment.repository';
import { User } from 'src/entities/user.entity';
import { ReportDTO } from '../dtos/report.response.dto';
import { UserDTO } from '../dtos/user.response.dto';
import { BoardDTO } from '../dtos/board.response.dto';
import { CommentDTO } from '../dtos/comment.response.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly userRepository: UserRepository,
    private readonly boardRepository: BoardRepository,
    private readonly commentRepository: CommentRepositoty,
  ) {}

  async findAllReport(): Promise<ReportDTO[]> {
    // 여러 블로그를 뒤져 봤을때 이렇게 프로미스 하던데 솔직히 이해는 하고 쓰는 느낌은 아님.
    try {
      const reports = await this.reportRepository.findAllReport();
      return reports.map((report) => {
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

        if (report.board) {
          const BoardDto = new BoardDTO();
          BoardDto.id = report.board.id;
          BoardDto.title = report.board.title;
          BoardDto.content = report.board.content;
          reportDto.board = BoardDto;
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
        throw new HttpException('User Not Found', 404);
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  async createBoardReport(
    body: ReportRequestDto,
    reportedBoardId: number,
    reporter: User,
  ) {
    try {
      const reportedBoard =
        await this.boardRepository.findOneBoardId(reportedBoardId);
      if (!reportedBoard) {
        throw new HttpException('Comuunity Not Found', 404);
      }
      const report = await this.reportRepository.createBoardReport(
        body,
        reportedBoard,
        reporter,
      );
      return {
        id: report.id,
        reportedBoard,
        reason: report.reason,
        tags: report.tags,
        reporter: report.reporter,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
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
        throw new HttpException('Comment not found', 404);
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }
}
