import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { TransactionDto } from './dto/transaction.dto';
import { PostsDto } from './dto/posts.dto';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  info() {
    return this.userService.findById();
  }

  @Post('transaction')
  transaction(@Req() req, @Body() body: TransactionDto) {
    return this.userService.transaction(req, body);
  }

  @Post('create_posts')
  createPosts(@Req() req, @Body() postsDto: PostsDto) {
    return this.userService.createPosts(req, postsDto);
  }

  @Get('posts')
  posts() {
    return this.userService.posts();
  }
}
