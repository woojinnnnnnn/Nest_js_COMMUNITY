import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import { AuthService } from '../services/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { JwtAuthGuard } from '../jwt/jwt.guard';

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
  signIn(@Body() body: SignInRequestDto) {
    return this.authService.signIn(body);
  }

  // 로그아웃. -------------------------------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('signOut')
  async signOut(@Req() req, @Res() res) {
    const user = req.user;
    await this.authService.signOut(user.id);

    return res.status(200).json({ message: 'SEX' })
  }
}
