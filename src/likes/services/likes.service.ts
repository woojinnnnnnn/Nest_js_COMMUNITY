import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from 'src/boards/repositories/board.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { LikeRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly userRepository: UserRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  // 좋아요 && 취소 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async addLike(boardId: number, userId: number) {
    try {
      const community = await this.boardRepository.findOneBoardId(boardId);
      if (!community) {
        throw new NotFoundException('Community not found');
      }

      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingLike = await this.likeRepository.findLikeByCommunityAndUser(
        boardId,
        userId,
      );
      if (existingLike) {
        await this.likeRepository.deleteLike(existingLike.id);
        return { message: 'Like removed' };
      }

      return await this.likeRepository.addLike(boardId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }
}
