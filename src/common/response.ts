import {
  CallHandler,
  ExecutionContext,
  HttpCode,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map } from 'rxjs';

@Injectable()
export class Response implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const code = context.switchToHttp().getResponse().statusCode;
    const success = code === HttpStatus.OK;
    return next.handle().pipe(
      map((data) => ({
        data,
        success,
        code,
        message: success ? '成功' : '失败',
      })),
    );
  }
}
