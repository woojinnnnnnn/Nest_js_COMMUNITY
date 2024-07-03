import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
      Strategy,
      'accessToken',
) {
      // constructor()
}