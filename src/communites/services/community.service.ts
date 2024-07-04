import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommunityRepository } from '../repositories/community.repository';
import { CreateComuDto } from '../dtos/create.post.dto';
import { FindAllComuDto } from '../dtos/find.all.post.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly communityRepostoty: CommunityRepository) {}

  async createComu(body: CreateComuDto) {
    const { title, content } = body;
    if (!title) {
      throw new UnauthorizedException('Title is Must Not Empty');
    }
    if (!content) {
      throw new UnauthorizedException('Content is Must Not Empty');
    }

    const createPost = await this.communityRepostoty.createComu({
      title,
      content,
    });
    return createPost;
  }

  async findAllComu() {
    return await this.communityRepostoty.findAllComu();
  }

  async findOneComu(id: number) {
    const community = await this.communityRepostoty.findOneComu(id);
    if (!community) {
      throw new NotFoundException(`Community with Id ${id} not found.`);
    }
    return community;
  }
}
