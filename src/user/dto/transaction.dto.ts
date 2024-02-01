import { IsNotEmpty } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty({ message: '不能为空' })
  to: string;

  @IsNotEmpty({ message: '不能为空' })
  amount: number;
}
