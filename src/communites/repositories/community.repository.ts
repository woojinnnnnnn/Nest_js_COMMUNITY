import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { CreateComuDto } from '../dtos/create.post.dto';

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
      return await this.communityRepository.find({
        select: ['id', 'title', 'veiwCount', 'createdAt', 'updatedAt'],
      });
    } catch (error) {
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

  //     async updateComu(id: any, userId: any, body: UpdateComuDto) {
  //       try {
  //         const community = await this.communityRepository.findOne({
  //           where: { id },
  //           relations: ['user']
  //         });

  //         if (!community) {
  //           throw new NotFoundException(`Community with id ${id} not Found`);
  //         }
  //         if (!community.user || community.user.id !== userId) {
  //           throw new HttpException('Not Allowd', 401);
  //         }

  //         community.title = body.title;
  //         community.content = body.content;

  //         await this.communityRepository.save(community);

  //         return community;
  //       } catch (error) {
  //         console.error('Error in updateComu:', error); // 로그 추가
  //         throw new HttpException('Server Error', 500);
  //       }
  //     }
}
