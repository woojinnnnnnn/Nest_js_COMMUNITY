import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrtegy extends PassportStrategy(Strategy) {
  constructor(
      private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload & { exp: number }) {
    const { id, email, role, exp } = payload;
    const expire = exp * 1000;

    if (id && email) {
      if (Date.now() < expire) {
        // 토큰 유효
        return { id, email, role };
      }
      // payload에 정보는 잘 있으나 token 만료
      throw new HttpException('토큰 만료', 401);
    } else {
      // Payload에 정보가 없음
      throw new HttpException('접근 오류', 401);
    }
  }
}
