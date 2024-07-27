import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const createComu = await this.communityRepository.createComu(body, user);
      // 리스폰스 디티오 별도 관리 인원
      return {
        id: createComu.id,
        title: createComu.title,
        content: createComu.content,
        createdAt: createComu.createdAt,
        userId: createComu.user.id,
        email: createComu.user.email,
        nickName: createComu.user.nickName,
      };
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllComu() {
    try {
      return await this.communityRepository.findAllComu();
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findOneComu(id: number) {
    try {
      const community = await this.communityRepository.findOneComu(id);
      return community;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 수정  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateComu(id: number, body: UpdateComuDto, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User Not Founed?');
      }

      const updateComu = await this.communityRepository.updateComu(
        id,
        body,
        user,
      );
      // 리스폰스 디티오 별도 관리 인원
      return {
        id: updateComu.id,
        title: updateComu.title,
        content: updateComu.content,
        createdAt: updateComu.createdAt,
        updatedAt: updateComu.updatedAt,
        userId: updateComu.user.id,
        email: updateComu.user.email,
        nickName: updateComu.user.nickName,
      };
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteComu(id: number, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User Not FOFOFOFOFUNd');
      }
      const deleteComu = await this.communityRepository.deleteComu(id, user);

      return {
        id: deleteComu.id,
        title: deleteComu.title,
        content: deleteComu.content,
        createdAt: deleteComu.createdAt,
        updatedAt: deleteComu.updatedAt,
        userId: deleteComu.user.id,
        email: deleteComu.user.email,
        nickName: deleteComu.user.nickName,
      };
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
