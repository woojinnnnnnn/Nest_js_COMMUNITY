import {
  HttpException,
  Injectable,
  NotFoundException,
  Options,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SignUpRequestDto } from 'src/auth/dtos/signup.request.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// auth 에는 레포 가 없고 User <- 에서 만들어야 했는데 이미 늦었다..
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

  // 고윳값 기준 유저 검색. -------------------------------------------------------------------------
  async findUserById(id: any) {
    try {
      const user = await this.authRepository.findOne({
        where: { id },
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

  // 유저 추가 ------------------------------------------------------------------------------------
  async createUser(body: SignUpRequestDto) {
    try {
      return await this.authRepository.save(body);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 리프레쉬 토큰 해시화  --------------------------------------------------------------------
  async hashedRefreshToken(id: number, refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.authRepository.update(id, { hashedRefreshToken });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
