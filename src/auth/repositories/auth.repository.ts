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

  // 이메일 기준 유저 검색.
  async findUserByEmail(email: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    return user;
  }
  async findUserByNickName(nickName: string) {
      const user = await this.authRepository.findOne({ where: { nickName } })
      return user;
  }

  async createUser(body: SignUpRequestDto) {
    return await this.authRepository.save(body);
  }
}
