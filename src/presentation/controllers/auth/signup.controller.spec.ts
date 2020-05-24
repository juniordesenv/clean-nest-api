import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SignupController } from '~/presentation/controllers/auth/signup.controller';
import { AppModule } from '~/app.module';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { SignupService } from '~/domain/services/auth/signup.service';

const makeFakeAddUserDto = (): AddUserDto => ({
  name: 'any_email',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
});

const mockMailerService = {
  sendMail: async () => new Promise((resolve) => resolve()),
};

describe('SignupController', () => {
  let signupController: SignupController;
  let signupService: SignupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
      providers: [
      ],
      controllers: [],
    })
      .overrideProvider(MailerService)
      .useValue(mockMailerService)
      .compile();

    signupController = moduleRef.get<SignupController>(SignupController);
    signupService = moduleRef.get<SignupService>(SignupService);
  });

  describe('Signup handle', () => {
    test('Should call AddUser with correct values', async () => {
      const addSpy = jest.spyOn(signupController, 'handle');

      await signupController.handle(makeFakeAddUserDto());
      expect(addSpy).toHaveBeenCalledWith({
        name: 'any_email',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      });
    });

    test('Should return throws with 500 if AddUser throws', async () => {
      jest.spyOn(signupService, 'add').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())));

      await expect(signupController.handle(makeFakeAddUserDto())).rejects.toMatchObject(
        new HttpException(
          'Erro inesperado',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    test('Should return throws with 400 if AddUser throws', async () => {
      await expect(signupController.handle(makeFakeAddUserDto())).rejects.toMatchObject(
        new HttpException(
          'Email já cadastrado',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    test('Should message of success if valid data is correct', async () => {
      const httpRespnse = await signupController.handle({
        ...makeFakeAddUserDto(),
        email: 'new_email@test.com.br',
      });
      expect(httpRespnse).toEqual('Cadastro efetuado com sucesso!');
    });

    test('Should message of success if valid data is correct', async () => {
      const httpRespnse = await signupController.handle({
        ...makeFakeAddUserDto(),
        email: 'new_email',
      });
      expect(httpRespnse).toEqual('Cadastro efetuado com sucesso!');
    });
  });
});
