// eslint-disable-next-line max-classes-per-file
import { Test } from '@nestjs/testing';
import { DocumentType } from '@typegoose/typegoose';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { AppModule } from '~/app.module';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { SignupService } from '~/domain/services/auth/signup.service';
import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { User } from '~/infra/db/mongodb/models/user.model';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { DbAddUser } from '~/data/usecases/user/db-add-user';
import { Config } from '~/data/interfaces/config/config.interface';
import { SenderMail } from '~/data/interfaces/mailer/sender-mail.interface';

jest.mock('../../../data/usecases/user/db-add-user');

const makeConfig = (): Config => {
  class ConfigStub implements Config {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(value: string): string {
      return 'any_value';
    }
  }
  return new ConfigStub();
};

const makeSenderMail = (): SenderMail => {
  class SenderMailStub implements SenderMail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {
      return new Promise((resolve) => resolve({
        messageId: '1',
      }));
    }
  }
  return new SenderMailStub();
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new HasherStub();
};

const makeUuidV4 = (): UuidV4 => {
  class UuidV4Stub implements UuidV4 {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    v4(): string {
      return 'any_value';
    }
  }
  return new UuidV4Stub();
};

const makeFakeUser = (): any => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  confirmToken: 'any_token',
});

const makeFakeUserData = (): AddUserDto => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
  passwordConfirmation: 'valid_password',
  username: 'valid_name',
});

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(userData: AddUserDto): Promise<DocumentType<User>> {
      return new Promise((resolve) => resolve(makeFakeUser()));
    }
  }
  return new AddUserRepositoryStub();
};


interface SutTypes {
  hasherStub: Hasher,
  addUserRepositoryStub: AddUserRepository
  configStub: Config,
  senderMailStub: SenderMail
  uuidV4Stub: UuidV4,
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addUserRepositoryStub = makeAddUserRepository();
  const configStub = makeConfig();
  const senderMailStub = makeSenderMail();
  const uuidV4Stub = makeUuidV4();
  return {
    hasherStub,
    addUserRepositoryStub,
    configStub,
    senderMailStub,
    uuidV4Stub,
  };
};

describe('SignupService', () => {
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
      .compile();

    signupService = moduleRef.get<SignupService>(SignupService);
  });


  describe('Signup add', () => {
    test('Should call add with correct values and params', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        configStub,
        senderMailStub,
        uuidV4Stub,
      } = makeSut();
      const addSpy = jest.spyOn(signupService, 'add');

      const mockedUser = {
        confirmToken: 'any_token',
      };

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce((): any => new Promise((resolve) => resolve(mockedUser)));

      await signupService.add(
        makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      );

      expect(addSpy).toHaveBeenCalledWith({
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
        username: 'valid_name',
      },
      addUserRepositoryStub,
      hasherStub,
      uuidV4Stub,
      configStub,
      senderMailStub);
    });

    test('Should create instance of DbAddUser with correct values', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      } = makeSut();

      jest.clearAllMocks();


      const mockedUser = {
        confirmToken: 'any_token',
      };

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce((): any => new Promise((resolve) => resolve(mockedUser)));

      await signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub);

      expect(DbAddUser).toHaveBeenCalledTimes(1);
      expect(DbAddUser).toHaveBeenCalledWith(hasherStub, addUserRepositoryStub, uuidV4Stub);
    });

    test('Should call DbAddUser add with correct values', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      } = makeSut();

      const mockedUser = {
        confirmToken: 'any_token',
      };

      const addSpy = jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce((): any => new Promise((resolve) => resolve(mockedUser)));

      await signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub);

      expect(addSpy).toHaveBeenCalledWith({
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
        username: 'valid_name',
      });
    });

    test('Should call SendEmail if AddUser on success', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      } = makeSut();

      const sendEmailSpy = jest.spyOn(senderMailStub, 'sendMail');


      const mockedUser = {
        confirmToken: 'any_token',
      };

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce((): any => new Promise((resolve) => resolve(mockedUser)));

      await signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub);

      expect(sendEmailSpy).toHaveBeenCalledTimes(1);
      expect(sendEmailSpy).toHaveBeenCalledWith({
        to: 'valid_email',
        from: 'any_value',
        subject: 'Cadastro efetuado com sucesso ✔',
        template: 'welcome',
        context: {
          confirmToken: 'any_token',
          name: 'valid_name',
          frontEndUrl: 'any_value',
        },
      });
    });

    test('Should call remove user if SendEmail fails', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      } = makeSut();

      const mockedUser = {
        remove: jest.fn(),
      };

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce((): any => new Promise((resolve) => resolve(mockedUser)));

      jest.spyOn(senderMailStub, 'sendMail').mockResolvedValueOnce(new Promise((resolve, reject) => reject()));

      try {
        await signupService.add(makeFakeUserData(),
          addUserRepositoryStub,
          hasherStub,
          uuidV4Stub,
          configStub,
          senderMailStub);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      expect(mockedUser.remove).toHaveBeenCalledTimes(1);
    });

    test('Should throws error if AddUser fails', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      } = makeSut();


      jest.spyOn(DbAddUser.prototype, 'add')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

      const promise = signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub);

      await expect(promise).rejects.toThrow();
    });

    test('Should throws error if SendEmail fails', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
      } = makeSut();


      jest.spyOn(senderMailStub, 'sendMail')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

      const promise = signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub);

      await expect(promise).rejects.toThrow();
    });
  });
});
