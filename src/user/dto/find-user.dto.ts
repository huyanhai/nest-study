import { IsNotEmpty } from 'class-validator';

export class FindUserDto {
  @IsNotEmpty({ message: '不能为空' })
  userId: string;
}
