import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepositoty } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dtos/create.comment.dto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CommunityRepository } from 'src/communites/repositories/community.repository';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepositoty,
    private readonly userRepository: UserRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  // 댓글 및 대댓글 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComment(id: number, body: CreateCommentDto, userId: number) {
    const community = await this.communityRepository.findOneComuId(id);

    if (!community) {
      throw new NotFoundException(`Community with id ${id} not found`);
    }

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const newComment = new Comment();
    newComment.community = community;
    newComment.content = body.content;
    newComment.user = user;

    // 여기서 부모 댓글.
    if (body.parentCommentId) {
      const parentComment = await this.commentRepository.findOne(
        body.parentCommentId,
      );
      if (!parentComment) {
        throw new NotFoundException(
          `Parent comment with id ${body.parentCommentId} not found`,
        );
      }
      newComment.parentComment = parentComment;
    }

    return this.commentRepository.createComment(newComment);
  }

  // 커뮤니티 id 를 통한 댓글 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async getCommentByCommunityId(id: number) {
    return this.commentRepository.findCommentByCommunityId(id);
  }

  async deleteComment(id: number, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('USererjsdfb');
      }
      const deleteComment = await this.commentRepository.deleteComment(
        id,
        user,
      );
      return {
            id: deleteComment.id,
            content: deleteComment.content,
            userId: deleteComment.user.id,
            email: deleteComment.user.email,
            nickName: deleteComment.user.nickName
      }
    } catch (error) {
      throw new HttpException('Server error', 500);
    }
  }
}
