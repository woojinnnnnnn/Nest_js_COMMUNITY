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
import { UserInfoDto } from 'src/users/dtos/userInfo.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
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
  // 테스트 로컬 로그인 방식 ------------------------------------------------------------------------------------
  async testSignIn(body: LoginRequestDto) {
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
      throw new UnauthorizedException(`Please Check Email Or Password`);
    }

    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      nickName: user.nickName,
    });

    const refreshToken = this.generateRefreshToken(user.id);

    await this.authRepository.hashedRefreshToken(
      user.id,
      refreshToken.refreshToken,
    );

    return {
      accessToken: accessToken.accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }

  // AccessToken CREATE -----------------------------------------------------------------------
  generateAccessToken(userInfoDto: UserInfoDto) {
    const accessToken = this.jwtService.sign(userInfoDto, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
    return { accessToken };
  }

  // RefreshToken CREATE -----------------------------------------------------------------------
  generateRefreshToken(id: any) {
    const payload = { id }; // refresh 토큰에 담을 값.
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('RT_JWT_SECRET'),
      expiresIn: '7d',
    });
    return { refreshToken };
  }

  // RefreshAccessToken CREATE -------------------------------------------------------------------
  async refreshAccessToken(refreshToken: string) {
    const payload: any = this.jwtService.decode(refreshToken); // decode
    const user = await this.authRepository.findUserById(payload.id);
    if (refreshToken === user.hashedRefreshToken) {
      const accesstoken = this.generateAccessToken({
        id: user.id,
        email: user.email,
        nickName: user.nickName,
      });
      return accesstoken;
    } else {
      return false;
    }
  }
  compareTokenExpiration(exp: number) {
    const time = new Date().getTime() / 1000;
    const isExpired = exp < time ? true : false;
    return isExpired;
  }
}
