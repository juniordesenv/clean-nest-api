import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from '~/app.module';
import { ConfirmEmailUserDto } from '~/domain/dto/user/confirm-email-user.dto';
import { ConfirmEmailController } from '~/presentation/controllers/auth/confirm-email.controller';
import { ConfirmEmailService } from '~/domain/services/auth/confirm-email.service';

const makeFakeConfirmEmailUserDto = (): ConfirmEmailUserDto => ({
  confirmToken: 'any_email',
});


describe('ConfirmEmailController', () => {
  let confirmEmailController: ConfirmEmailController;
  let confirmEmailService: ConfirmEmailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
      providers: [
      ],
      controllers: [],
    })
      .compile();


    confirmEmailController = moduleRef.get<ConfirmEmailController>(ConfirmEmailController);
    confirmEmailService = moduleRef.get<ConfirmEmailService>(ConfirmEmailService);
  });

  describe('ConfirmEmail handle', () => {
    test('Should call ConfirmEmailUser with correct values', async () => {
      const confirmEmailSpy = jest.spyOn(confirmEmailController, 'handle');

      jest.spyOn(confirmEmailService, 'confirmEmailByToken').mockImplementationOnce(async () => new Promise((resolve) => resolve(true)));

      await confirmEmailController.handle(makeFakeConfirmEmailUserDto());
      expect(confirmEmailSpy).toHaveBeenCalledWith({
        confirmToken: 'any_email',
      });
    });

    test('Should return throws with 500 if ConfirmEmailUser throws', async () => {
      jest.spyOn(confirmEmailService, 'confirmEmailByToken').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())));

      await expect(confirmEmailController.handle(makeFakeConfirmEmailUserDto()))
        .rejects.toMatchObject(
          new HttpException(
            'Erro inesperado',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    });

    test('Should return throws with 400 if verifiedEmail is false', async () => {
      jest.spyOn(confirmEmailService, 'confirmEmailByToken').mockImplementationOnce(async () => new Promise((resolve) => resolve(false)));

      await expect(confirmEmailController.handle(makeFakeConfirmEmailUserDto()))
        .rejects.toMatchObject(
          new HttpException(
            'Token não encontrado!',
            HttpStatus.BAD_REQUEST,
          ),
        );
    });
  });
});
