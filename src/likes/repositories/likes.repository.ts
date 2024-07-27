import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  // 좋아요 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async addLike(communityId: number, userId: number) {
    try {
      const like = this.likeRepository.create({
        community: { id: communityId },
        user: { id: userId },
        flag: true,
      });
      return await this.likeRepository.save(like);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  /**
  > id <- 값이 커뮤니티 아이디 값이 되어 버려 새롭게 수정중.
   */

  // communityId && userId 값 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findLikeByCommunityAndUser(communityId: number, userId: number) {
    try {
      return await this.likeRepository.findOne({
        where: {
          community: { id: communityId },
          user: { id: userId },
        },
      });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 좋아요 취소 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteLike(id: number) {
    try {
      await this.likeRepository.delete(id);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
