import { Controller, Get, HttpException, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleType } from 'src/common/type/role.type';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get()
  async findOneReport(@Req() req) {
    try {
      const user = req.user;
      return user
    } catch (error) {
      throw new HttpException('Server ERRor', 500);
    }
  }
}
