import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import { AuthService } from '../services/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { LoginRequestDto } from '../dtos/login.req.dto';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원 가입. -------------------------------------------------------------------------
  @Post('signUp')
  async signUp(@Body() body: SignUpRequestDto) {
      const user = this.authService.signUp(body);
      return user;
  }

  // 로그인. -------------------------------------------------------------------------
  @Post('signIn')
  signIn(@Body() body: LoginRequestDto) {
      return this.authService.signIn(body)
  }

  // 로그아웃. -------------------------------------------------------------------------
  @Post('signOut')
  signOut() {
    return 'signOut';
  }

  @Post('testSignIn')
  testSignIn(@Body() body: LoginRequestDto) {
    return this.authService.testSignIn(body)
  }
}
