import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { CreateCommentDto } from '../dtos/create.comment.dto';
import { CommunityRepository } from 'src/communites/repositories/community.repository';

@Injectable()
export class CommentRepositoty {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly communityRepository: CommunityRepository,
  ) {}

  async createComment(body: CreateCommentDto) {
    return this.commentRepository.save(body);
  }

  async findCommentByCommunityId(communityId: number) {
    return this.commentRepository.find({
      where: {
        deletedAt: null,
        community: { id: communityId },
      },
      select: {
        user: {
          id: true,
          email: true,
          nickName: true,
          role: true,
        },
      },
      relations: ['user'],
    });
  }
}
