import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './\bjwt.payload';
import { AuthRepository } from '../repositories/auth.repository';

// 인증시에 사용.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      // 헤더에서 토큰을 추출.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 임시 시크릿 키.
      secretOrKey: process.env.JWT_SECRET,
      // 만료 기간.
      ignoreExpiration: false,
    });
  }

  // 인증 부분.
  async validate(payload: Payload) {
      const user = await this.authRepository.findUserById(
            payload.sub,
      );
      
      if(user) {
            return user // request.user <- 안에 들어감
      } else {
            throw new UnauthorizedException('400000004')
      }
  }
}
