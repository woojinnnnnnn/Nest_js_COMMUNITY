import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../jwt/jwt.payload';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { SignUpRequestDto } from '../dtos/signUp.requst.dto';
import { SignUpVerifyPasswordRequestDto } from 'src/auth/dtos/signUpVerifyPasswordRequest.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 회원 가입 ------------------------------------------------------------------------------------
  async signUp(body: SignUpVerifyPasswordRequestDto) {
    try {
      const { email, nickName, password, verifyPassword } = body;
      const isExistUser = await this.userRepository.findUserByEmail(email);

      if (isExistUser) {
        throw new HttpException(`${email} is Already Exists..`, 409);
      }
      const isExistNickName =
        await this.userRepository.findUserByNickName(nickName);

      if (isExistNickName) {
        throw new HttpException(`${nickName} is Already Exists`, 409);
      }

      if (password !== verifyPassword) {
        throw new HttpException('Passwords do not match', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const signUpUser: SignUpRequestDto = {
        // 리퀘스트가 아니라 리스폰스 로 바꾸어야함,,
        email,
        nickName,
        password: hashedPassword,
      };

      const user = await this.userRepository.createUser(signUpUser);

      return user.readOnlyData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  // 로그인 ------------------------------------------------------------------------------------
  async signIn(body: SignInRequestDto) {
    try {
      const { email, password } = body;

      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        throw new HttpException(`Not Exist ${user}`, 404);
      }

      const isPasswordValidated = await bcrypt.compare(password, user.password);

      if (isPasswordValidated) {
        const payload = { id: user.id, email: user.email, role: user.role };
        const { accessToken, refreshToken } = await this.createToken(payload);

        await this.userRepository.hashedRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
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
    try {
      const user = await this.userRepository.findUserById(id);

      if (!user) {
        throw new HttpException('User Not Found', 404);
      }

      const isRefreshTokenValid =
        await this.userRepository.validateRefreshToken(id, refreshToken);

      if (!isRefreshTokenValid) {
        throw new HttpException('Valid Faill', 400);
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const tokens = await this.createToken(payload);

      await this.userRepository.hashedRefreshToken(
        user.id,
        tokens.refreshToken,
      );

      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }
}
