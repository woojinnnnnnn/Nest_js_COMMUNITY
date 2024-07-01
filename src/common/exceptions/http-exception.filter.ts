import {
      ExceptionFilter,
      Catch,
      ArgumentsHost,
      HttpException,
    } from '@nestjs/common';
    import { Request, Response } from 'express';
    
    @Catch(HttpException)
    export class HttpExceptionFilter implements ExceptionFilter {
      catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const error = exception.getResponse() as
          | string
          | { error: string; statusCode: number; message: string | string[] };
          // 오브젝트일 경우 네스트 자체에서 제이슨 형식으로 전달, 스트링 일 경우 넣어둔 경우 
    
        if (typeof error === 'string') {
          response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            error,
          });
          // 에러가 스트링일 경우, 스트링이 아닐 경우 분기 처리.
        } else {
          response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...error,
          });
        }
      }
    }
    