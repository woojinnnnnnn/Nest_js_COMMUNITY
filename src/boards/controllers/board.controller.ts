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
  ValidationPipe,
} from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dtos/create.request.dto';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UpdateBoardDto } from '../dtos/update.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Body(ValidationPipe) body: CreateBoardDto, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.createBoard(body, userId);
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @Get()
  async findAllBoard() {
    return await this.boardService.findAllBoard();
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOneBoard(@Param('id') id: number) {
    return await this.boardService.findOneBoard(id);
  }

  // 게시글 수정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateBoard(
    @Param('id') id: number,
    @Body() body: UpdateBoardDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.boardService.updateBoard(id, body, userId);
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteBoard(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.deleteBoard(id, userId);
  }
}
