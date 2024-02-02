import { Inject, Injectable, Req } from '@nestjs/common';
import { FindUserDto } from './dto/find-user.dto';
import prisma from 'db';
import { TransactionDto } from './dto/transaction.dto';
import { PostsDto } from './dto/posts.dto';

import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(@Inject('REQUEST') private readonly req: Request) {}

  async checkUser() {
    const user = this.req['user'];

    const findUser = await prisma.user.findFirst({
      where: { account: user.account },
    });

    if (findUser) {
      return findUser;
    }
  }

  async findById() {
    const user = await this.checkUser();

    // 事务
    // 同时执行多个sql，要么一起成功，要么一起失败
    // prisma.$transaction([])

    if (user) {
      return {
        account: user.account,
      };
    }
    return '用户不存在';
  }

  async transaction(req, transactionDto: TransactionDto) {
    const from = await prisma.user.findFirst({
      where: {
        account: req['user'].account,
      },
    });

    const to = await prisma.user.findFirst({
      where: { account: transactionDto.to },
    });

    const amount = Number(transactionDto.amount);
    if (!from || !to) {
      return '用户不存在';
    } else {
      if (from.balance >= transactionDto.amount) {
        // 执行事务
        await prisma.$transaction(async (prisma) => {
          await prisma.user.update({
            data: {
              balance: {
                decrement: amount,
              },
            },
            where: { account: from.account },
          });
          const toBalance = await prisma.user.update({
            data: {
              balance: {
                increment: amount,
              },
            },
            where: {
              account: to.account,
            },
          });

          return toBalance;
        });

        return '转账成功';
      } else {
        return '余额不足';
      }
    }
  }

  async createPosts(req, postsDto: PostsDto) {
    const user = await this.checkUser();

    if (user) {
      await prisma.post.create({
        data: {
          title: postsDto.title,
          body: postsDto.body,
          user: {
            // 通过id和user的id进行关联
            connect: { id: user.id },
          },
        },
      });

      const posts = await prisma.post.findMany({
        select: {
          user: { select: { account: true } },
          title: true,
          body: true,
        },
      });

      return posts;
    } else {
      return '用户不存在';
    }
  }

  async posts() {
    const user = await this.checkUser();

    if (user) {
      const posts = await prisma.post.findMany({
        // 过滤掉不必要的数据
        select: {
          user: { select: { account: true } },
          title: true,
          body: true,
        },
      });
      return posts;
    } else {
      return '用户不存在';
    }
  }
}
