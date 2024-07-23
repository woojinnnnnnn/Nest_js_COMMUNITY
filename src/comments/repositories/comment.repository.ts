import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CreateCommentDto } from '../dtos/create.comment.dto';

@Injectable()
export class CommentRepositoty {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // 댓글 생성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComment(body: CreateCommentDto) {
    return this.commentRepository.save(body);
  }

  // 코멘트 찾기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  async findCommentByCommunityId(communityId: number) {
      return this.commentRepository.find({
        where: {
          deletedAt: null,
          community: { id: communityId },
        },
        relations: ['user', 'parentComment', 'childComments'],
      });
  }

  // 댓글 Id 로 단일 댓글 조회... ? - - - - - - - - - - - - - - - - - - - - 
  async findOne(id: number) {
      return this.commentRepository.findOne({
            where: {id},
            relations: ['user', 'parentComment', 'childComments'],
      })
  }
}