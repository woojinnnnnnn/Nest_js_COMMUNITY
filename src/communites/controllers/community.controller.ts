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
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UpdateComuDto } from '../dtos/update.post.dto';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   @UseGuards(JwtAuthGuard)
//   @Post()
//   async createComu(@Body() body: CreateComuDto, @Req() req) {
//       const userId = req.user.sub
//     const createdPost = await this.communityService.createComu(
//       body,
//       userId
//     );
//     return createdPost;
//   }

  @UseGuards(JwtAuthGuard)
  @Post('/test')
  async createCComu( @Req() req, @Body() body: CreateComuDto,) {
      const userId = req.user.id;
      return await this.communityService.createCComu(body, userId )
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
//   @UseGuards(JwtAuthGuard)
//   @Patch('/:id')
//   async updateComu(
//     @Param('id') id: number,
//     @Body() body: UpdateComuDto,
//     @Req() req,
//   ) {
//     console.log('User:', req.user); // 디버깅 로그 추가
//     return await this.communityService.updateComu(id, body, req.user.id);
//   }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComu(@Param('id') id: number) {}
}
