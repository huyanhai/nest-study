import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserDto } from './dto/find-user.dto';
import { TransactionDto } from './dto/transaction.dto';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  info(@Query() query: FindUserDto, @Req() req) {
    return this.userService.findById(query, req);
  }

  @Post('transaction')
  transaction(@Req() req, @Body() body: TransactionDto) {
    return this.userService.transaction(req, body);
  }
}
