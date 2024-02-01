import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { comparePassword, encodePassword } from '../utils/bcrypt';
import prisma from '../db';

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
        return '注册成功';
      } else {
        return '用户已存在';
      }
    }
    return '验证码错误';
  }

  async signIn(signInDto: SignInDto) {
    const user = await prisma.user.findFirst({
      where: {
        account: signInDto.account,
      },
    });

    if (!user) {
      return '用户不存在';
    }

    if (!comparePassword(signInDto.pwd, user.pwd)) {
      return '密码错误';
    }

    const payload = { account: user.account };

    return await this.jwtService.signAsync(payload);
  }
}
