import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { access } from 'fs';

import { interval, map, take } from 'rxjs';

import { zip } from 'compressing';

@Controller({ path: 'file', version: '1' })
export class UploadController {
  constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 处理文件的装饰器
  upload(@UploadedFile() file) {
    return file.filename;
  }

  // 使用管道对数据进行转换
  @Get('test/:id')
  test(@Query('id', ParseIntPipe) id: number) {
    console.log(id);
  }

  // 使用管道对数据进行转换
  @Get('test1')
  test1() {
    console.log('test1');
  }

  @Get('pic/:id')
  download(@Param('id') id, @Res() res) {
    const path = join(__dirname, `../../image/${id}.png`);
    access(path, (err) => {
      if (err) {
        // 处理异常
        return res.status(HttpStatus.BAD_REQUEST).send('文件不存在');
      } else {
        return res.download(path);
      }
    });
  }

  // 返回文件流
  @Get('stream/:id')
  stream(@Param('id') id, @Res() res) {
    const path = join(__dirname, `../../image/${id}.png`);
    access(path, (err) => {
      if (err) {
        // 处理异常
        return res.status(HttpStatus.BAD_REQUEST).send('文件不存在');
      } else {
        // 压缩文件
        const stream = new zip.Stream();
        stream.addEntry(path);

        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${id}.zip`,
        });

        // 返回流
        stream.pipe(res);
      }
    });
  }

  // rxjs
  @Get('rxjs')
  rxjs(@Res() res) {
    const sub = interval(100)
      .pipe(
        map((v) => ({
          name: v,
        })),
      )
      .pipe(take(5))
      .subscribe((v: any) => {
        console.log(v);
        if (v.name === 3) {
          // 停止订阅
          sub.unsubscribe();
        }
      });
    return res.status(HttpStatus.OK).send('ok');
  }
}
