import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommunityRepository } from '../repositories/community.repository';
import { CreateComuDto } from '../dtos/create.post.dto';
import { UpdateComuDto } from '../dtos/update.post.dto';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { Community } from 'src/entities/community.entity';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepostoty: CommunityRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //   async createComu(body: CreateComuDto, userId: number) {
  //     const { title, content } = body;
  //     if (!title) {
  //       throw new UnauthorizedException('Title is Must Not Empty');
  //     }
  //     if (!content) {
  //       throw new UnauthorizedException('Content is Must Not Empty');
  //     }

  //     if(!userId) {
  //       throw new UnauthorizedException('Not Allowed')
  //     }
  //     const createPost = await this.communityRepostoty.createComu({
  //       title,
  //       content,
  //       userId,
  //     });
  //     return createPost;
  //   }

  async createCComu(body: CreateComuDto, userId: number) {
    const user = await this.authRepository.findUserById(userId)

    const { title, content } = body;

    const community = new Community()
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllComu() {
    return await this.communityRepostoty.findAllComu();
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findOneComu(id: number) {
    const community = await this.communityRepostoty.findOneComu(id);
    return community;
  }

  //   async updateComu(id: number, body: UpdateComuDto, userId: number) {
  //     return this.communityRepostoty.updateComu(id, body, userId);
  //   }
}
