import { JwtModule } from '@nestjs/jwt';

import { secret, expiration } from './constants/auth';

JwtModule.register({
  global: true,
  secret,
  signOptions: { expiresIn: expiration },
});

export { JwtModule };
