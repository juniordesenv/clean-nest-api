import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

export interface SenderMail {
  sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo>
}
