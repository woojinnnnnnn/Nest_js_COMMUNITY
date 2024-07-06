import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../repositories/community.repository';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { CreateComuDto } from '../dtos/create.post.dto';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly authRepository: AuthRepository,
  ) {}

    // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComu(body: CreateComuDto, userId: number) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.communityRepository.createComu(body, user);
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllComu() {
    return await this.communityRepository.findAllComu();
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findOneComu(id: number) {
    const community = await this.communityRepository.findOneComu(id);
    return community;
  }

  //     async updateComu(id: number, body: UpdateComuDto, userId: number) {
  //       return this.communityRepository.updateComu(id, body, userId);
  //     }
}
