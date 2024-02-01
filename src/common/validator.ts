import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class Validator implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // 将传入的数据跟DTO进行绑定
    const plainValue = plainToInstance(metadata.metatype, value);

    if (plainValue) {
      // 使用validate对实例的数据进行校验，返回的是一个异步数组
      const errList = await validate(plainValue);

      // 如果不为空，则有校验错误的数据
      if (errList.length) {
        const [one] = errList;
        // 组装错误数据返回给前端
        const message = Object.keys(one.constraints)
          .map((key) => {
            return `${one.property}${one.constraints[key]}`;
          })
          .join(',');
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
      return value;
    }
  }
}
