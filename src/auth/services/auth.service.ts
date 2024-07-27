import {
  HttpException,
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
    try {
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
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 로그인 ------------------------------------------------------------------------------------
  async signIn(body: SignInRequestDto) {
    try {
      const { email, password } = body;

      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException(`Not Exist ${user}`);
      }
      const isPasswordValidated = await bcrypt.compare(password, user.password);
      if (isPasswordValidated) {
        const payload = { id: user.id, email: user.email, role: user.role };
        const { accessToken, refreshToken } = await this.createToken(payload);

        await this.userRepository.hashedRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
      }
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 로그아웃 ------------------------------------------------------------------------------------
  async signOut(id: number) {
    await this.userRepository.signOut(id);
  }

  // 토큰 부여 Ver 1.2 ------------------------------------------------------------------------------------
  async createToken({ id, email, role }: Payload) {
    const payload: Payload = { id, email, role };
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

  // 리프레쉬 토큰 검중 후 재발급.  -----------------------------------------------------------------------------
  async refreshTokens(id: number, refreshToken: string) {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('User Not FOund');
    }

    const isRefreshTokenValid = await this.userRepository.validateRefreshToken(
      id,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Valid Failllll');
    }

    const payload = { id: user.id, email: user.email, role: user.role};
    const tokens = await this.createToken(payload);

    await this.userRepository.hashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
