import { Test } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerAdapter } from './mailer.adapter';
import { AppModule } from '~/app.module';

const mockMailerService = {
  sendMail: async () => new Promise((resolve) => resolve({
    messageId: 'any_id',
  })),
};

const makeSut = (mailerService: MailerService): MailerAdapter => new MailerAdapter(mailerService);

describe('Mailer Adapter', () => {
  let mailerService: MailerService;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useValue(mockMailerService)
      .compile();

    mailerService = moduleFixture.get<MailerService>(MailerService);
  });

  test('Should call sendMail with correct value', async () => {
    const sut = makeSut(mailerService);
    const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
    await sut.sendMail({
      to: 'any@email.com.br',
      from: 'from@email.com.br',
      subject: 'Any title',
      template: 'welcome',
      context: {
        name: 'any name',
      },
    });
    expect(sendMailSpy).toHaveBeenCalledWith({
      to: 'any@email.com.br',
      from: 'from@email.com.br',
      subject: 'Any title',
      template: 'welcome',
      context: {
        name: 'any name',
      },
    });
  });


  test('Should return a messageInfo with id on success', async () => {
    const sut = makeSut(mailerService);
    const messageInfo = await sut.sendMail({
      to: 'any@email.com.br',
      from: 'from@email.com.br',
      subject: 'Any title',
      template: 'welcome',
      context: {
        name: 'any name',
      },
    });
    expect(messageInfo.messageId).toBe('any_id');
  });


  test('Should throw if hash throws', async () => {
    const sut = makeSut(mailerService);
    jest.spyOn(mailerService, 'sendMail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.sendMail({
      to: 'any@email.com.br',
      from: 'from@email.com.br',
      subject: 'Any title',
      template: 'welcome',
      context: {
        name: 'any name',
      },
    });
    await expect(promise).rejects.toThrow();
  });
});
