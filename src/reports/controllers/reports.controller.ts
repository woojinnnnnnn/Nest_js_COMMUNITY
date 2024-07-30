import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleType } from 'src/common/type/role.type';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { ReportRequestDto } from '../dtos/report.request.dto';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  // 신고 확인.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get()
  async getReport(@Req() req) {
    try {
      const user = req.user;
      return await this.reportService.findAllReport()
    } catch (error) {
      throw new HttpException('Server ERRor', 500);
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('/user/:id')
  async createUserReport(
    @Body() body: ReportRequestDto,
    @Param('id') userId: number, // 신고 당할 사람
    @Req() req,
  ) {
    const reporter = req.user;
    return await this.reportService.createUserReport(body, userId, reporter);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/community/:id')
  async createComuReport(@Body() body: ReportRequestDto, @Param('id') communityId: number, @Req() req) {
      const reporter = req.user; // 이름만 봐도 알겠지만 신고 '한' 유저
      return await this.reportService.createComuReport(body, communityId, reporter)
  }

  @UseGuards(JwtAuthGuard)
  @Post('comment/:id')
  async createCommentReport(@Body() body: ReportRequestDto, @Param('id') commentId: number, @Req() req) {
      const reporter = req.user;
      return await this.reportService.createCommentReport(body, commentId, reporter)
  }
}
