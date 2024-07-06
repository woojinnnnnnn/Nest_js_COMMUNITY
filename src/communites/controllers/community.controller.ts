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

  @Post()
  async createCComu(@Body() body: CreateComuDto, @Req() req) {
    const userId = req.user.id;
    const createComu = await this.communityService.createComu(body, userId);

    const responseComuDto: ResponseComuDto = {
      id: createComu.id,
      title: createComu.title,
      content: createComu.content,
      createdAt: createComu.createdAt,
      userId: createComu.user.id,
      email: createComu.user.email,
      nickName: createComu.user.nickName,
    };
    return responseComuDto;
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
  //     @UseGuards(JwtAuthGuard)
  //     @Patch('/:id')
  //     async updateComu(@Param('id') id: number, @Body() body: UpdateComuDto, @Req() req,) {
  //       const userId = req.user.id
  //       const updateComu = await this.communityService.updateComu(id, body,userId)

  //       return updateComu
  //     }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateComu(
    @Param('id') id: number,
    @Body() body: UpdateComuDto,
    @Req() req,
  ) {
      
    const userId = req.user.id;
    console.log('CommunityController - updateComu - userId:', userId);
    console.log('CommunityController - updateComu - id:', id);
    console.log('CommunityController - updateComu - body:', body);
    const updateComu = await this.communityService.updateComu(id, body, userId);

    return {
      success: true,
      data: {
        id: updateComu.id,
        title: updateComu.title,
        content: updateComu.content,
        viewCount: updateComu.veiwCount,
        createdAt: updateComu.createdAt,
        updatedAt: updateComu.updatedAt,
        user: {
          id: updateComu.user.id,
          email: updateComu.user.email,
          nickName: updateComu.user.nickName,
        },
      },
    };
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComu(@Param('id') id: number) {}
}
