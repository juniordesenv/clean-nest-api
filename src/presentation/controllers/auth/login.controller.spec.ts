import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from '~/app.module';
import { LoginUserDto } from '~/domain/dto/user/login-user.dto';
import { LoginController } from '~/presentation/controllers/auth/login.controller';
import { LoginService } from '~/domain/services/auth/login.service';

const makeFakeLoginUserDto = (): LoginUserDto => ({
  password: 'any_password',
  username: 'valid_username',
});


describe('LoginController', () => {
  let loginController: LoginController;
  let loginService: LoginService;

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

    loginController = moduleRef.get<LoginController>(LoginController);
    loginService = moduleRef.get<LoginService>(LoginService);
  });

  describe('Signup handle', () => {
    test('Should call Login with correct values', async () => {
      const loginSpy = jest.spyOn(loginController, 'handle');

      await loginController.handle(makeFakeLoginUserDto());
      expect(loginSpy).toHaveBeenCalledWith({
        password: 'any_password',
        username: 'valid_username',
      });
    });

    test('Should return throws with 500 if Login throws', async () => {
      jest.spyOn(loginService, 'login').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())));

      await expect(loginController.handle(makeFakeLoginUserDto()))
        .rejects.toMatchObject(
          new HttpException(
            'Erro inesperado',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    });

    test('Should return correct data on success', async () => {
      jest.spyOn(loginService, 'login').mockImplementationOnce(async () => new Promise((resolve) => resolve({
        accessToken: 'any_token',
      })));

      const httpRespnse = await loginController.handle(makeFakeLoginUserDto());

      expect(httpRespnse).toEqual({
        accessToken: 'any_token',
      });
    });
  });
});
