import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import { AuthService } from '../services/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class AuthController {
      constructor (private readonly authService: AuthService) {}

      @Get()
      getUsers() {
            return 'getUsers' // or 로그인 한 유저
      }

      @Get()
      getUser() {
            return 'getOneUser'
      }

      @Post('signUp')
      async signUp(@Body() body: SignUpRequestDto) {
            return this.authService.signUp(body)
      }

      @Post('signIn')
      signIn() {
            return 'signin'
      }

      @Post('signOut')
      signOut() {
            return 'signOut'
      }

      @Post()
      uploadImg() {
            return 'img'
      }
}
