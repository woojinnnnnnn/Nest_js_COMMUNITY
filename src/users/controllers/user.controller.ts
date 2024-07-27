import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  getUserInfo(@Req() req) {
    try {
      const user = req.user;
      const { id, email } = user;
      return { id, email };
    } catch (error) {
      throw new HttpException('Server Errror', 500);
    }
  }

  // 이미지 업로드 예정 ?? -------------------------------------------------------------------------
  @Post()
  uploadImg() {
    return 'img';
  }
}
