import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../repositories/community.repository';
import { CreateComuDto } from '../dtos/create.post.dto';
import { UpdateComuDto } from '../dtos/update.post.dto';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComu(body: CreateComuDto, userId: number) {
    const user = await this.userRepository.findUserById(userId);
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

    // 게시글 수정  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateComu(id: number, body: UpdateComuDto, userId: number) {
      console.log('CommunityService - updateComu - id:', id);
      console.log('CommunityService - updateComu - body:', body);
      console.log('CommunityService - updateComu - userId:', userId);
    const user = await this.userRepository.findUserById(userId)
    if(!user) {
      throw new NotFoundException('User Not Founed?')
    }

    return this.communityRepository.updateComu(id, body, user)
  }
}
