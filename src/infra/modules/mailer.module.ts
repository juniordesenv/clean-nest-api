
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';

export const MailerModule = NestMailerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('EMAIL_SMTP_HOST'),
      port: configService.get<number>('EMAIL_SMTP_PORT'),
      secure: configService.get<boolean>('EMAIL_SMTP_SECURE'),
      auth: {
        user: configService.get<string>('EMAIL_SMTP_USERNAME'),
        pass: configService.get<string>('EMAIL_SMTP_PASSWORD'),
      },
    },
    template: {
      dir: path.join(__dirname, '/../templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
});
