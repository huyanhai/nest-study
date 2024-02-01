import { Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user.dto';
import prisma from 'db';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class UserService {
  async findById(query: FindUserDto, req) {
    const reqUser = req['user'];
    const user = await prisma.user.findFirst({
      where: { userId: query.userId, account: reqUser.account },
    });

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
}
