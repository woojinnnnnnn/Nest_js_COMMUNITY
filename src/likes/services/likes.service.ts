import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from 'src/communites/repositories/community.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { LikeRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly userRepository: UserRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  // 좋아요 && 취소 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async addLike(communityId: number, userId: number) {
      try {
        const community = await this.communityRepository.findOneComuId(communityId);
        if (!community) {
          throw new NotFoundException('Community not found');
        }
  
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
  
        const existingLike = await this.likeRepository.findLikeByCommunityAndUser(communityId, userId);
        if (existingLike) {
          await this.likeRepository.deleteLike(existingLike.id);
          return { message: 'Like removed' };
        }
  
        return await this.likeRepository.addLike(communityId, userId);
      } catch (error) {
        throw new HttpException('Server Error', 500);
      }
    }
}
