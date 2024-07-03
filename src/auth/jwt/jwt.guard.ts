import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// 이게 주입 받는 다면 ? -> 스트레티지 의 밸리데이트 함수 실행.