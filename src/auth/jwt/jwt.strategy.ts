import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
      constructor() {
            super({
                  // 헤더에서 토큰을 추출.
                  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                  // 임시 시크릿 키.
                  secretOrKey: 'asdasd',
                  // 만료 기간.
                  ignoreExpiration: false,
            })
      }

      // 인증 부분.
      // async validate(payload) {}
}