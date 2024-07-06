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

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createComu(body: CreateComuDto, user: User): Promise<Community> {
    const { title, content } = body;
    const community = this.communityRepository.create({
      title,
      content,
      user,
    });
    return await this.communityRepository.save(community);
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllComu() {
    try {
      const communities = await this.communityRepository.find({
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
          }
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
        where: { id },
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

  //   async updateComu(id: number, body: UpdateComuDto, user: User): Promise<Community> {
  //       try {
  //         const community = await this.communityRepository.findOne({
  //           where: { id },
  //           relations: ['user'],
  //         });

  //         if (!community) {
  //           throw new NotFoundException(`Community with id ${id} not found`);
  //         }

  //         if (community.user.id !== user.id) {
  //           throw new ForbiddenException(
  //             'You do not have permission to edit this post',
  //           );
  //         }

  //         community.title = body.title;
  //         community.content = body.content;

  //         await this.communityRepository.save(community);
  //         return community;
  //       } catch (error) {
  //         throw new HttpException('Server Error', 500);
  //       }
  //     }

  async updateComu(id: number, body: UpdateComuDto, user: User) {
    try {
      console.log('updateComu - id:', id);
      console.log('updateComu - body:', body);
      console.log('updateComu - user:', user);
      const community = await this.communityRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!community) {
        console.error(`updateComu - Community with id ${id} not found`);
        throw new NotFoundException(`Community with id ${id} not found`);
      }

      if (community.user.id !== user.id) {
        console.error(
          `updateComu - User with id ${user.id} does not have permission to edit community with id ${id}`,
        );
        throw new ForbiddenException(
          'You do not have permission to edit this post',
        );
      }

      community.title = body.title;
      community.content = body.content;

      await this.communityRepository.save(community);
      console.log('updateComu - updated community:', community);
      return community;
    } catch (error) {
      console.error('updateComu - error:', error);
      throw new HttpException('Server Error', 500);
    }
  }
}
