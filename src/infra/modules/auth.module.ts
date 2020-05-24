import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '~/infra/modules/users.module';
import { SignupController } from '~/presentation/controllers/auth/signup.controller';
import { SignupService } from '~/domain/services/auth/signup.service';

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [
    SignupController,
  ],
  providers: [
    SignupService,
    ConfigService,
  ],
  exports: [
  ],
})
export class AuthModule {}
