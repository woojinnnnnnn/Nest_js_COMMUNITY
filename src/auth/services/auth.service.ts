import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import * as bcrypt from 'bcrypt';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../jwt/jwt.payload';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 회원 가입 ------------------------------------------------------------------------------------
  async signUp(body: SignUpRequestDto) {
    const { email, nickName, password } = body;
    const isExistUser = await this.userRepository.findUserByEmail(email);

    if (isExistUser) {
      throw new UnauthorizedException(`${email} is Already Exists..`);
    }
    const isExistNickName =
      await this.userRepository.findUserByNickName(nickName);

    if (isExistNickName) {
      throw new UnauthorizedException(`${nickName} is Already Exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser({
      email,
      nickName,
      password: hashedPassword,
    });
    return user.readOnlyData;
  }

  // 로그인 ------------------------------------------------------------------------------------
  async signIn(body: SignInRequestDto) {
    const { email, password } = body;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`Not Exist ${user}`);
    }
    const isPasswordValidated = await bcrypt.compare(password, user.password);
    if (isPasswordValidated) {
      const payload = { id: user.id, email: user.email };
      const { accessToken, refreshToken } = await this.createToken(payload);

      return { accessToken, refreshToken };
    }
  }

  // 토큰 부여 Ver 1.2 ------------------------------------------------------------------------------------
  async createToken({ id, email }: Payload) {
    const payload: Payload = { id, email };
    const secret = this.configService.get<string>('JWT_SECRET');

    const accessToken = this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
