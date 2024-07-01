import {
  HttpException,
  Injectable,
  NotFoundException,
  Options,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
  ) {}

  // 이메일 기준 유저 검색. -------------------------------------------------------------------------
  async findUserByEmail(email: string) {
    try {
      const user = await this.authRepository.findOne({
        where: { email },
        select: [
          'id',
          'email',
          'nickName',
          'role',
          'password',
          'hashedRefreshToken',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      });
      return user;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
  // 닉네임 기준 유저 검색. -------------------------------------------------------------------------
  async findUserByNickName(nickName: string) {
    try {
      const user = await this.authRepository.findOne({ where: { nickName } });
      return user;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 유저 추가 ------------------------------------------------------------------------------------
  async createUser(body: SignUpRequestDto) {
    try {
      return await this.authRepository.save(body);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
