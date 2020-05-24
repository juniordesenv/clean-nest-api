import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { SenderMail } from '~/data/interfaces/mailer/sender-mail.interface';


export class MailerAdapter implements SenderMail {
  constructor(
    private readonly mailerService: MailerService,
  ) { }

  async sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {
    return this.mailerService.sendMail(sendMailOptions);
  }
}
