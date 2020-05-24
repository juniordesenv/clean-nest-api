
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongodbModule } from '~/infra/modules/mongodb.module';
import { UsersModule } from '~/infra/modules/users.module';
import { AuthModule } from '~/infra/modules/auth.module';
import { MailerModule } from '~/infra/modules/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongodbModule,
    MailerModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
  ],
  providers: [],
})
export class AppModule {}
