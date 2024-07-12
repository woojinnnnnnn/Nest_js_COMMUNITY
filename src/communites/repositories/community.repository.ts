import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { CreateComuDto } from '../dtos/create.post.dto';
import { UpdateComuDto } from '../dtos/update.post.dto';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  // 생각 해보니 좀 많이 바보 처럼 하고 있었네.. 서비스 로직에서 가공 해야 하는데 여기서 가공을 더 많이 했네

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComu(body: CreateComuDto, user: User) {
    const { title, content } = body;
    const community = this.communityRepository.create({
      title,
      content,
      user, // 이런식으로 반환 하니까 정보가 다 나오는구나.. 씁..
    });
    return await this.communityRepository.save(community);
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllComu() {
    try {
      const communities = await this.communityRepository.find({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          veiwCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            email: true,
            nickName: true,
          },
        },
        relations: ['user'],
      });

      return communities;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findOneComu(id: number) {
    try {
      const community = await this.communityRepository.findOne({
        where: { id, deletedAt: null },
      });
      // 레포 로직에서 veiw 카운트 올리긴 하는데 .. 이건 서비스 로직으로 옮기는게 나을지.. ?
      if (!community) {
        throw new HttpException(`Community with id ${id} not found.`, 404);
      }
      community.veiwCount = community.veiwCount + 1;
      await this.communityRepository.save(community);

      return community;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 수정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateComu(id: number, body: UpdateComuDto, user: User) {
    try {
      const community = await this.communityRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!community) {
        throw new NotFoundException(`Community with id ${id} not found`);
      }

      if (community.user.id !== user.id) {
        throw new ForbiddenException(
          'You Do NNot Have PPermission To Edit This PPPPost',
        );
      }
      community.title = body.title;
      community.content = body.content;

      await this.communityRepository.save(community);
      return community;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async deleteComu(id: number, user: User) {
    try {
      const community = await this.communityRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!community) {
        throw new NotFoundException(`Community with id ${id} not found`);
      }
      if (community.user.id !== user.id) {
        throw new ForbiddenException(
          'You Do NNot Have PPermission To Edit This PPPPost',
        );
      }
      if (community.deletedAt !== null) {
        throw new HttpException('Already Gone.', 200);
      }

      await this.communityRepository.softDelete(id);

      return community
    } catch (error) {}
  }
}
