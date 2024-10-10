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
    const success = [HttpStatus.OK, HttpStatus.CREATED].includes(code);
    return next.handle().pipe(
      map((data) => {
        return {
          success,
          code: success ? HttpStatus.OK : code,
          ...data,
        };
      }),
    );
  }
}
