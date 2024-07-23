import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from '../dtos/signup.req.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 이메일 기준 유저 검색. -------------------------------------------------------------------------
  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
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
      const user = await this.userRepository.findOne({ where: { nickName } });
      return user;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 고윳값 기준 유저 검색. -------------------------------------------------------------------------
  async findUserById(id: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'nickName',
          'role',
          'createdAt',
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
      return await this.userRepository.save(body);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 로그아웃.  ----------------------------------------------------------------------------
  async signOut(id: number) {
    try {
      await this.userRepository.update(id, {
        hashedRefreshToken: null
      })
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 리프레쉬 토큰 해시화  --------------------------------------------------------------------
  async hashedRefreshToken(id: number, refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

      await this.userRepository.update(id, {
        hashedRefreshToken: hashedRefreshToken,
      })
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 리프레쉬 토큰 검증.  --------------------------------------------------------------------
  async validateRefreshToken(id: number, refreshToken: string) {
    try {
      const user = await this.findUserById(id)
      if(!user || !user.hashedRefreshToken) {
        return '검증 실패..?'
      }
      return await bcrypt.compare(refreshToken, user.hashedRefreshToken)
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
