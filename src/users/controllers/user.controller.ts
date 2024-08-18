import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateNickNameDto } from '../dtos/update.nickname.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteUserDto } from '../dtos/delete.user.dto';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // 사용자 내 정보 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Get('/info')
  findUserInfo(@Req() req) {
    try {
      const user = req.user;
      const { id, email } = user;
      return { id, email };
    } catch (error) {
      throw new HttpException('Server Errror', 500);
    }
  }

  // 사용자 닉네임 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Patch('/change-nickName')
  async updateNickName(@Body() body: UpdateNickNameDto, @Req() req) {
    const userId = req.user.id;
    return await this.userService.updateNickName(body, userId);
  }

  // 사용자 프로필 추가..? 로 해야할듯 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadTest(@UploadedFile() profileImage: Express.Multer.File) {
    console.log(profileImage);
  }

    // 회원 탈퇴 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteUser(@Body() body: DeleteUserDto, @Req() req) {
      const userId = req.user.id;
      await this.userService.deleteUser(userId, body)
      return { message: 'Success' }
    }


}
