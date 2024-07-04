import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest:
        //authorization에서 jwt 추출
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      //만료기간은 직접 제어
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }
  async validate(
    req: Request,
    payload: { sub: string; exp: number; idx: number },
  ) {
    if (!this.authService.compareTokenExpiration(payload.exp)) {
      //req.user에 값이 저장된다.
      return this.authRepository.findUserById(payload.idx);
    } else {
      throw new UnauthorizedException('Access token has been expired.');
    }
  }
}
