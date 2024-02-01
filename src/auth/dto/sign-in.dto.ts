import { IsNotEmpty, IsString, Length } from 'class-validator';
export class SignInDto {
  @IsString()
  @IsNotEmpty({ message: '不能为空' })
  account: string;

  @IsString()
  @IsNotEmpty({ message: '不能为空' })
  @Length(null, undefined, {
    message: '长度不能小于6',
  })
  pwd: string;

  @IsString()
  code: string;
}
