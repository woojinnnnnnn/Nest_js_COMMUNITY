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
import { User, UserStatus } from 'src/entities/user.entity';
import { VerifyEmailDto } from '../dtos/verify.email.dto';

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

  // 구글 소셜 로그인 할 경로. -------------------------------------------------------------------------
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    console.log('GET GOOGLE/LOGIN');
  }

  // 구글 소셜 로그인 로그인 후 해당 페이지로 연결 경로.-------------------------------------------------------------------------
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user as User;
    const tokens = await this.authService.createTokensSocialLogin({
      id: user.id,
      email: user.email,
      role: UserStatus.CLIENT,
    });
    res.json(tokens);
  }

  // 아직 네이버 밖에 메일 관련 서비스를 세팅 해두지 않아서 기존의 로컬 로그인 방식은 유지.
  // 네이버 인증 메일 전송. ----------------------------------------------------------------------------------- - - - - - - - -
  @Post('email-SignUp')
  async emailSignUp(@Body(ValidationPipe) body: SignUpVerifyPasswordRequestDto) {
    try {
      const user = await this.authService.emailSignUp(body)
      await this.authService.sendVerificationCode(user)
      return { message: 'Sign-up Successful Plesae check Ur email for the Verification Code' }
    } catch (error) {
      throw new HttpException('Server Errror', 500)
    }
  }
 // 네이버 인증 메일 코드 확인. ----------------------------------------------------------------------------------- - - - - - - - -
  @Post('verify-email')
  async verifyEmail(@Body(ValidationPipe) body: VerifyEmailDto) {
    try {
      await this.authService.verifyEmail(body.email, body.verificationCode)
    } catch (error) {
      throw new HttpException(error.message || 'Server Error', 500)
    }
  }

}
