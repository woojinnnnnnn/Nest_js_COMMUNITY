import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { UpdateNickNameDto } from '../dtos/update.nickname.dto';
import { DeleteUserDto } from '../dtos/delete.user.dto';
import { UpdatePasswordDto } from '../dtos/update.password.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 닉네임 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateNickName(body: UpdateNickNameDto, userId: number) {
    try {
      const { nickName } = body;

      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const isExistNickName =
        await this.userRepository.findUserByNickName(nickName);
      if (isExistNickName) {
        throw new HttpException('Nickname already in use', 402);
      }

      await this.userRepository.updateUser(body, user);

      return {
        after_nickName: nickName,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  // 회원 탈퇴 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteUser(userId: number, body: DeleteUserDto) {
    try {
      const { password } = body;

      const user = await this.userRepository.findUserByIdWithPasswod(userId);

      if (!user) {
        throw new HttpException('User not Found', 404);
      }

      const isPasswordValidated = await bcrypt.compare(password, user.password);

      if (!isPasswordValidated) {
        throw new HttpException(`dosen't match Password`, 400);
      }

      await this.userRepository.deleteUser(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  // 사용자 프로필 추가 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateProfileImage(userId: number, file: Express.Multer.File) {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new HttpException('User Not Found', 404);
      }
      const imagePath = `/uploads/${file.filename}`;
      return this.userRepository.updateProfileImage(userId, imagePath);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('SErver Error', 500);
      }
    }
  }

  // 사용자 비밀번호 업데이트 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updatePassword(userId: number, body: UpdatePasswordDto) {
    try {
      const { currentPassword, changePassword, verifyPassword } = body;

      const user =
        await this.userRepository.findUserByIdAndIncludePassword(userId);

      if (!user) {
        throw new HttpException(`User not found with ID ${userId}`, 404);
      }

      const isMatchedPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isMatchedPassword) {
        throw new HttpException('Current password is incorrect', 400);
      }

      if (changePassword !== verifyPassword) {
        throw new HttpException('New passwords do not match', 400);
      }

      const hashedPassword = await bcrypt.hash(changePassword, 10);

      return await this.userRepository.updatePasswordUser(
        userId,
        hashedPassword,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }
}
