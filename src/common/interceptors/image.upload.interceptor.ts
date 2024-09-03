import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RequestHandler } from 'express';
import { diskStorage } from 'multer';
import * as multer from 'multer'
import { extname } from 'path';
import { Observable } from 'rxjs';

// 커스텀 인터셉터를 만들어 컨트롤러에서 정의 하는 것이 아닌 컨스트럭터 에 정의해 여기서 처리.
@Injectable()
export class ImageUploadInterceptor implements NestInterceptor {
  private upload: RequestHandler;

  constructor() {
    this.upload = multer({
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }).single('image');
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    return new Observable((observer) => {
      this.upload(req, null, async (err: any) => {
        if (err) {
          observer.error(err);
        } else {
          next.handle().subscribe(observer);
        }
      });
    });
  }
}
