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
  ValidationPipe,
} from '@nestjs/common';
import { SignUpVerifyPasswordRequestDto } from 'src/auth/dtos/signUpVerifyPasswordRequest.request.dto';
import { AuthService } from '../services/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { GoogleAuthGuard } from '../jwt/jwt.google.guard';
import { User } from 'src/entities/user.entity';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원 가입. -------------------------------------------------------------------------
  @Post('signUp')
  async signUp(@Body(ValidationPipe) body: SignUpVerifyPasswordRequestDto) {
    try {
      const user = this.authService.signUp(body);
      return user;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 로그인. -------------------------------------------------------------------------
  @Post('signIn')
  async signIn(@Body() body: SignInRequestDto) {
    try {
      return this.authService.signIn(body);
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 로그아웃. -------------------------------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('signOut')
  async signOut(@Req() req, @Res() res) {
    try {
      const user = req.user;
      await this.authService.signOut(user.id);
      // 여기 저기 뒤져 보니까 아래 예전에 하던 방식으로 리스폰스 가능 하단걸 깨닮..
      // 이러면 근데 인터셉터에도 안걸리네
      return res.status(200).json({ message: 'Successed Sign-Out' });
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    console.log('GET GOOGLE/LOGIN')
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    const user = req.user as User;
    return user
   }
}
