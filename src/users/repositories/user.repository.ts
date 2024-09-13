import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from '../../auth/dtos/signUp.requst.dto';
import * as bcrypt from 'bcrypt';
import { UpdateNickNameDto } from '../dtos/update.nickname.dto';
import { UpdatePasswordDto } from '../dtos/update.password.dto';

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
  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'nickName', 'role', 'createdAt'],
      });
      return user;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 고윳값 기준 유저 검색. 비밀번호 까지 리턴.
  async findUserByIdWithPasswod(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'nickName', 'password', 'createdAt']
      })
      return user;
    } catch (error) {
      throw new HttpException('Server Errror', 500)
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
        hashedRefreshToken: null,
      });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 닉네임 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateUser(body: UpdateNickNameDto, user: User) {
    user.nickName = body.nickName;

    return await this.userRepository.save(user);
  }

//  회원 탈퇴 기능 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id : userId },
    });
    await this.userRepository.softDelete(userId)
    return user
  }

  // 사용자 프로필 추가 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateProfileImage(userId: number, imagePath: string) {
    const user = await this.findUserById(userId)

    user.profileImage = imagePath;
    return await this.userRepository.save(user)
  }

  // 사용자 비밀번호 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updatePasswordUser(userId: number, hashedPassword: string) {
    try {
      await this.userRepository.update(userId, { password: hashedPassword });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 찾을때 Password 필드가 필요한 부분이 있어서 추가 - - - - - - - - - -- - - - - - - - - - - - - - - - -
  async findUserByIdAndIncludePassword(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      select: ['id', 'email', 'nickName', 'role', 'createdAt', 'password'],
    });
  }

  // Google 소셜 로그인 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findByEmailOrSave(email: string, profile: any) {
    let user = await this.findUserByEmail(email);

    if(!user) {
      user = this.userRepository.create({
        email: email,
        nickName: profile.name.givenName,
        password: '',
        profileImage: profile.photos[0]?.value,
        role: UserStatus.CLIENT
      });

      await this.userRepository.save(user)
    }
    return user
  }


  // 리프레쉬 토큰 해시화  --------------------------------------------------------------------
  async hashedRefreshToken(id: number, refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.userRepository.update(id, {
        hashedRefreshToken: hashedRefreshToken,
      });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 리프레쉬 토큰 검증.  --------------------------------------------------------------------
  async validateRefreshToken(id: number, refreshToken: string) {
    try {
      const user = await this.findUserById(id);
      if (!user || !user.hashedRefreshToken) {
        return '검증 실패..?';
      }
      return await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }
}
