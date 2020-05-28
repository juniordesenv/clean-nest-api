// eslint-disable-next-line max-classes-per-file
import { Test } from '@nestjs/testing';
import { AppModule } from '~/app.module';
import { LoginModel } from '~/domain/usecases/user/login.interface';
import { LoadUserByEmailOrUsernameRepository } from '~/data/interfaces/db/user/load-user-by-email-or-username-repository';
import { UserModel } from '~/domain/models/user.interface';
import { HashComparer } from '~/data/interfaces/cryptography/hash-comparer.interface';
import { Encrypter } from '~/data/interfaces/cryptography/encrypter.interface';
import { LoginService } from '~/domain/services/auth/login.service';
import { DbLoginUser } from '~/data/usecases/user/db-login-user';

const makeFakeUser = (): UserModel => ({
  _id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  email: 'any_email@email.com.br',
  password: '123456',
  verifiedEmail: true,
  confirmToken: 'any_token',
});

const makeFakeLoginUserData = (): LoginModel => ({
  username: 'valid_token',
  password: '123456',
});

const makeLoadUserByEmailOrUsernameRepository = (): LoadUserByEmailOrUsernameRepository => {
  class LoadUserByEmailOrUsernameRepositoryStub implements LoadUserByEmailOrUsernameRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadByEmailOrUsername(emailOrUsername: string): Promise<any> {
      return Promise.resolve(makeFakeUser());
    }
  }
  return new LoadUserByEmailOrUsernameRepositoryStub();
};


const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async compare(value: string, hash :string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async encrypt(id: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new EncrypterStub();
};


interface SutTypes {
  loadUserByEmailOrUsernameRepositoryStub: LoadUserByEmailOrUsernameRepository,
  hashComparerStub: HashComparer,
  encrypterStub: Encrypter,
}

const makeSut = (): SutTypes => {
  const loadUserByEmailOrUsernameRepositoryStub = makeLoadUserByEmailOrUsernameRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  return {
    loadUserByEmailOrUsernameRepositoryStub,
    hashComparerStub,
    encrypterStub,
  };
};

describe('Login Service', () => {
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

    loginService = moduleRef.get<LoginService>(LoginService);
  });


  describe('Login', () => {
    test('Should call login with correct values and params', async () => {
      const {
        loadUserByEmailOrUsernameRepositoryStub,
        hashComparerStub,
        encrypterStub,
      } = makeSut();
      const loginSpy = jest.spyOn(loginService, 'login');

      jest.spyOn(DbLoginUser.prototype, 'login')
        .mockImplementationOnce((): any => new Promise((resolve) => resolve(true)));

      await loginService.login(
        makeFakeLoginUserData(),
        loadUserByEmailOrUsernameRepositoryStub,
        hashComparerStub,
        encrypterStub,
      );

      expect(loginSpy).toHaveBeenCalledWith({
        username: 'valid_token',
        password: '123456',
      },
      loadUserByEmailOrUsernameRepositoryStub,
      hashComparerStub,
      encrypterStub);
    });

    test('Should call login return accessToken on success', async () => {
      const {
        loadUserByEmailOrUsernameRepositoryStub,
        hashComparerStub,
        encrypterStub,
      } = makeSut();
      const resultLogin = await loginService.login(
        makeFakeLoginUserData(),
        loadUserByEmailOrUsernameRepositoryStub,
        hashComparerStub,
        encrypterStub,
      );

      expect(resultLogin.accessToken).toEqual('any_token');
    });

    test('Should throws error if DbLoginUser fails', async () => {
      const {
        loadUserByEmailOrUsernameRepositoryStub,
        hashComparerStub,
        encrypterStub,
      } = makeSut();


      jest.spyOn(DbLoginUser.prototype, 'login')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

      const promise = loginService.login(
        makeFakeLoginUserData(),
        loadUserByEmailOrUsernameRepositoryStub,
        hashComparerStub,
        encrypterStub,
      );

      await expect(promise).rejects.toThrow();
    });
  });
});
