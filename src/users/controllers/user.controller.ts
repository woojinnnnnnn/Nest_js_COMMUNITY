import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
// import { UserInfo } from 'src/common/decorators/user.decorator';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard) // 인증 처리
  @Get('info')
  getUserInfo(@Req() request) {
    const user = request.user;
    const { id, email, nickName } = user;
    return { id, email, nickName }
  }

  // 이미지 업로드 예정 ?? -------------------------------------------------------------------------
  @Post()
  uploadImg() {
    return 'img';
  }
}
