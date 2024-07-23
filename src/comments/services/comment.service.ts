import { Injectable, NotFoundException } from '@nestjs/common';
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
            private readonly communityRepository: CommunityRepository
      ) {}

      async createComment(id: number, body: CreateCommentDto, userId: number) {
            const community = await this.communityRepository.findOneComuId(id)

            if(!community) {
                  throw new NotFoundException(`Community with id ${id} not found`)
            }

            const user = await this.userRepository.findUserById(userId);
            if (!user) {
              throw new NotFoundException(`User with id ${userId} not found`);
            }

            const newComment = new Comment()
            newComment.community = community
            newComment.content = body.content;
            newComment.user = user;

            return this.commentRepository.createComment(newComment)
      }

      async getCommentByCommunityId(id: number) {
            return this.commentRepository.findCommentByCommunityId(id)
      }
}