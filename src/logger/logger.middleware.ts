import {
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// 인터셉터 방식은 라우트 핸들러를 지나야해 잘못된 요청이 찍히질 않아 추가 로거 생성

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // 이걸로 해결..?

  use(req: Request, res: Response, next: NextFunction) {
    // 요청 객체로부터 ip, http method, url, user agent를 받아온 후
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent');

    // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
      );
    });

    next();
  }
}