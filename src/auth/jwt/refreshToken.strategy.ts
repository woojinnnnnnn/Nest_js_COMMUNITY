import { PassportStrategy } from '@nestjs/passport';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refresh_token,
      ]),
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: config.get<string>('RT_JWT_SECRET'),
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; exp: number; idx: number },
  ) {
    if (!this.authService.compareTokenExpiration(payload.exp)) {
      const user = await this.authRepository.findUserById(payload.idx);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      req.user = user; 
      return user; // 리프레시도 마찬가지로 이걸 설정 안해두고 있었음...
    } else {
      throw new UnauthorizedException('Refresh token has expired.');
    }
  }
}
