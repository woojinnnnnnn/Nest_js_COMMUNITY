import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UsersService } from '../services/users.service';
import { SignUpRequestDto } from '../dtos/signup.req.dto';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
      constructor (private readonly userService: UsersService) {}
}
