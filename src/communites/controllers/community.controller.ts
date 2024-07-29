import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommunityService } from '../services/community.service';
import { CreateComuDto } from '../dtos/create.post.dto';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UpdateComuDto } from '../dtos/update.post.dto';
import { ResponseComuDto } from '../dtos/response.post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComu(@Body() body: CreateComuDto, @Req() req) {
    const userId = req.user.id;
    return await this.communityService.createComu(body, userId);
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @Get()
  async findAllComu() {
    return await this.communityService.findAllComu();
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOneComu(@Param('id') id: number) {
    return await this.communityService.findOneComu(id);
  }

  // 게시글 수정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateComu(@Param('id') id: number, @Body() body: UpdateComuDto, @Req() req,) {
    const userId = req.user.id;
    return await this.communityService.updateComu(id, body, userId);
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteComu(@Param('id') id: number, @Req() req) {
      const userId = req.user.id;
      return await this.communityService.deleteComu(id, userId)
  }
}
