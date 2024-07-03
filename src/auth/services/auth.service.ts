import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from '../dtos/login.req.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  // 회원 가입 ------------------------------------------------------------------------------------
  async signUp(body: SignUpRequestDto) {
      const { email, nickName, password } = body;
      const isExistUser = await this.authRepository.findUserByEmail(email);

      if (isExistUser) {
        throw new UnauthorizedException(`${email} is Already Exists..`);
      }
      const isExistNickName =
        await this.authRepository.findUserByNickName(nickName);

      if (isExistNickName) {
        throw new UnauthorizedException(`${nickName} is Already Exists`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.authRepository.createUser({
        email,
        nickName,
        password: hashedPassword,
      });
      return user.readOnlyData;
  }

  // 로그인 ------------------------------------------------------------------------------------
  async signIn(body: LoginRequestDto) {
      const { email, password } = body;

      const user = await this.authRepository.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException(`Can't Find User..`);
      }
      
      const isPasswordValidated: boolean = await bcrypt.compare(
        password,
        user.password,
      );
      if (!isPasswordValidated) {
        throw new UnauthorizedException(`Please Cheack Email Or Password`);
      }

      const payload = { sub: user.id, email: email };
      return {
        token: this.jwtService.sign(payload),
      };
  }
}
