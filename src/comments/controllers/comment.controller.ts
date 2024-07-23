import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dtos/create.comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('community/:communityId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('communityId') communityId: number,
    @Body() body: CreateCommentDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.commentService.createComment(communityId, body, userId);
  }

  @Get()
  async getCommentsByCommunityId(@Param('communityId') communityId: number) {
    return this.commentService.getCommentByCommunityId(communityId);
  }
}
