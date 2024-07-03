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
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
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
      return this.authRepository.findUserById(payload.idx);
    } else {
      throw new UnauthorizedException('Refresh token has been expired.');
    }
  }
}
