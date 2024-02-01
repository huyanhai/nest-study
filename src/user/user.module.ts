import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [], // 导入其他模块
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
