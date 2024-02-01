import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UploadModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
