import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CreateCommentDto } from '../dtos/create.comment.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CommentRepositoty {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // 댓글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComment(body: CreateCommentDto) {
    try {
      return this.commentRepository.save(body);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 코멘트 찾기 - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findCommentByCommunityId(communityId: number) {
    try {
      return this.commentRepository.find({
        where: {
          deletedAt: null,
          community: { id: communityId },
        },
        relations: ['user', 'parentComment', 'childComments'],
      });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 댓글 Id 로 단일 댓글 조회... ? - - - - - - - - - - - - - - - - - - - -
  async findOne(id: number) {
    try {
      return this.commentRepository.findOne({
        where: { id },
        relations: ['user', 'parentComment', 'childComments'],
      });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

    // 댓글 삭제 - - - - - - - - - - - - - - - - - - - -
  async deleteComment(id: number, user: User) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!comment) {
        throw new NotFoundException('못찾았데');
      }
      if (comment.user.id !== user.id) {
        throw new ForbiddenException('권한업데');
      }

      await this.commentRepository.softDelete(id);
      return comment;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
