import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      // 图片存放位置
      storage: diskStorage({
        destination: join(__dirname, '../../image'),
        filename(_, file, callback) {
          // 重命名文件
          const fileName = `${+new Date()}${extname(file.originalname)}`;
          callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
