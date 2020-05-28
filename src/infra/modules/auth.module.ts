import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '~/infra/modules/users.module';
import { SignupController } from '~/presentation/controllers/auth/signup.controller';
import { SignupService } from '~/domain/services/auth/signup.service';
import { ConfirmEmailService } from '~/domain/services/auth/confirm-email.service';
import { ConfirmEmailController } from '~/presentation/controllers/auth/confirm-email.controller';
import { LoginService } from '~/domain/services/auth/login.service';
import { LoginController } from '~/presentation/controllers/auth/login.controller';

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [
    SignupController,
    ConfirmEmailController,
    LoginController,
  ],
  providers: [
    SignupService,
    ConfigService,
    ConfirmEmailService,
    LoginService,
  ],
  exports: [
  ],
})
export class AuthModule {}
