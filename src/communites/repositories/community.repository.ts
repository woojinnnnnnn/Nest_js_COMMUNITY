import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateComuDto } from '../dtos/create.post.dto';
import { FindAllComuDto } from '../dtos/find.all.post.dto';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  async createComu(body: CreateComuDto) {
    try {
      return await this.communityRepository.save(body);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async findAllComu() {
    try {
      return await this.communityRepository.find({
        select: ['id', 'title', 'veiwCount', 'createdAt', 'updatedAt'],
      });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  async findOneComu(id: number) {
    try {
      const community = await this.communityRepository.findOne({ where: { id } });
      if(!community) {
            throw new HttpException(`Community with id ${id} not found.`, 404);
      }
      community.veiwCount = ( community.veiwCount ) + 1
      await this.communityRepository.save(community)

      return community
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
