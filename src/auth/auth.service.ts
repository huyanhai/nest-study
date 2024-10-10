import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { comparePassword, encodePassword } from '../utils/bcrypt';
import prisma from '../db';
import { responseData } from 'utils/response';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signUp(session, signUpDto: SignUpDto) {
    const code = signUpDto.code.toLowerCase();
    const sessionCode = session.code;

    if (code && sessionCode && code === sessionCode) {
      const user = await prisma.user.findFirst({
        where: { account: signUpDto.account },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            account: signUpDto.account,
            pwd: encodePassword(signUpDto.pwd),
          },
        });
        return responseData('注册成功', null);
      } else {
        return responseData('用户已存在', null);
      }
    }
    return responseData('验证码错误', null);
  }

  async signIn(signInDto: SignInDto) {
    const user = await prisma.user.findFirst({
      where: {
        account: signInDto.account,
      },
    });

    if (!user) {
      return responseData('用户不存在', null);
    }

    if (!comparePassword(signInDto.pwd, user.pwd)) {
      return responseData('密码错误', null);
    }

    const payload = { account: user.account };

    const token = await this.jwtService.signAsync(payload);
    return responseData('登录成功', token);
  }
}
