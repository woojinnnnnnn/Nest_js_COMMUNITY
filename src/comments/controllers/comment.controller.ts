import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dtos/create.comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('boards/:boardId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 및 대댓글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('boardId') boardId: number,
    @Body() body: CreateCommentDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return this.commentService.createComment(boardId, body, userId);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 커뮤니티 아이디 조회 를 통한 댓글 조회 - - - - - - - - - - - - - - - - - - - - - - - -
  @Get()
  async getCommentsByBoardId(@Param('boardId') boardId: number) {
    try {
      return this.commentService.getCommentByBoardId(boardId);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 댓글 삭제 - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteComment(@Param('id') id: number, @Req() req) {
    try {
      const userId = req.user.id;
      return await this.commentService.deleteComment(id, userId);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
