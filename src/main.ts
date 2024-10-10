import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { Response, HttpFilter, Validator } from './common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api');
  // 允许跨域
  app.enableCors();

  // 处理静态资源
  app.useStaticAssets(join(__dirname, '../image'), { prefix: '/static' });

  // 启用版本控制
  // v1/xxx
  app.enableVersioning({
    type: VersioningType.URI, // 放到url里面
  });

  // 设置cookie
  app.use(
    session({
      secret: 'hyh', // 加盐
      resave: false,
      saveUninitialized: true,
      // name: 'hyh', // cookie的名称
      cookie: {
        httpOnly: true, // 设置httpOnly，防止js读取
        maxAge: 1000 * 60 * 60 * 24 * 7, // 设置cookie的过期时间,单位是毫秒
      },
    }),
  );

  // 全局错误拦截
  app.useGlobalFilters(new HttpFilter());
  // 全局响应拦截
  app.useGlobalInterceptors(new Response());
  // 全局验证
  app.useGlobalPipes(new Validator());
  // 全局守卫
  // app.useGlobalGuards(new Guard());

  await app.listen(3000);
}
bootstrap();
