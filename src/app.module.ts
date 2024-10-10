import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WSModule } from 'ws/ws.module';

@Module({
  imports: [UploadModule, UserModule, AuthModule, WSModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
