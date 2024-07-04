import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommunityService } from '../services/community.service';
import { CreateComuDto } from '../dtos/create.post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('community')
export class CommunityController {
      constructor(private readonly communityService: CommunityService) {}

      @UseGuards(JwtAuthGuard)
      @Post()
      async createComu(@Body() body: CreateComuDto, @Req() req) {
            const createPost = this.communityService.createComu(body)
            return createPost
      }

      @Get()
      async findAllComu() {
            return await this.communityService.findAllComu()
      }

      @UseGuards(JwtAuthGuard)
      @Get('/:id')
      async findOneComu(@Param('id') id:number) {
            return await this.communityService.findOneComu(id)
      }

      @UseGuards(JwtAuthGuard)
      @Put('/:id')
      async updateComu(@Param('id') id: number) {

      }

      @UseGuards(JwtAuthGuard)
      @Delete()
      async deleteComu(@Param('id') id: number) {

      }
}
