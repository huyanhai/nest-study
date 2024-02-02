import { IsNotEmpty } from 'class-validator';

export class PostsDto {
  @IsNotEmpty({ message: '不能为空' })
  title: string;

  @IsNotEmpty({ message: '不能为空' })
  body: string;
}
