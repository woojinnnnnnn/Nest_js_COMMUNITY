import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new HttpException('익셉션 텟트', 401);
    return this.appService.getHello();
  }

  @Get(':id')
  getOneCat(@Param('id', ParseIntPipe) id: number) {
    console.log(id)
    console.log(typeof id)
    return 'get one cat';
  }
}
