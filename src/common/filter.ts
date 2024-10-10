import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception.getStatus();
    const body = {
      success: code < 300,
      code: exception.getStatus(),
      data: null,
      message: code === 401 ? '未登录' : exception.message,
    };
    return response.status(exception.getStatus()).json(body);
  }
}
