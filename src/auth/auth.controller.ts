import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Session,
  Res,
} from '@nestjs/common';

import * as svgCaptcha from 'svg-captcha';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Public } from '../common/role';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 注册
  @Post('sign_up')
  @Public()
  signUp(@Session() session, @Body() signUpDto: SignUpDto) {
    return this.authService.signUp(session, signUpDto);
  }

  // 登录
  @Post('sign_in')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // 获取验证码
  @Get('captcha')
  @Public()
  captcha(@Res() res, @Session() session) {
    const captcha = svgCaptcha.create({ size: 4, background: '#dedede' });

    // captcha.text存储的是具体的验证码
    // captcha.data存储的是图片数据
    session.code = captcha.text.toLowerCase(); // 将验证码保存到 session 中 toLowerCase不区分大小写
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
