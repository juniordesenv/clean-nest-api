// eslint-disable-next-line max-classes-per-file
import { Test } from '@nestjs/testing';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { AppModule } from '~/app.module';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { SignupService } from '~/domain/services/auth/signup.service';
import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { DbAddUser } from '~/data/usecases/user/db-add-user';
import { Config } from '~/data/interfaces/config/config.interface';
import { SenderMail } from '~/data/interfaces/mailer/sender-mail.interface';
import { UserModel } from '~/domain/models/user.interface';
import { DeleteUserByIdRepository } from '~/data/interfaces/db/user/delete-user-by-id-repository';

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

const makeFakeUser = (): UserModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  username: 'valid_username',
  email: 'valid_email',
  password: 'hashed_password',
  confirmToken: 'any_token',
  verifiedEmail: false,
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
    async add(userData: AddUserDto): Promise<UserModel> {
      return new Promise((resolve) => resolve(makeFakeUser()));
    }
  }
  return new AddUserRepositoryStub();
};


const makeDeleteUserByIdRepository = (): DeleteUserByIdRepository => {
  class DeleteUserByIdRepositoryStub implements DeleteUserByIdRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteById(id: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new DeleteUserByIdRepositoryStub();
};

interface SutTypes {
  hasherStub: Hasher;
  addUserRepositoryStub: AddUserRepository;
  configStub: Config;
  senderMailStub: SenderMail;
  uuidV4Stub: UuidV4;
  deleteUserByIdRepositoryStub: DeleteUserByIdRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addUserRepositoryStub = makeAddUserRepository();
  const configStub = makeConfig();
  const senderMailStub = makeSenderMail();
  const uuidV4Stub = makeUuidV4();
  const deleteUserByIdRepositoryStub = makeDeleteUserByIdRepository();
  return {
    hasherStub,
    addUserRepositoryStub,
    configStub,
    senderMailStub,
    uuidV4Stub,
    deleteUserByIdRepositoryStub,
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
        deleteUserByIdRepositoryStub,
      } = makeSut();
      const addSpy = jest.spyOn(signupService, 'add');

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce(() => new Promise((resolve) => resolve(makeFakeUser())));

      await signupService.add(
        makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub,
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
      senderMailStub,
      deleteUserByIdRepositoryStub);
    });

    test('Should create instance of DbAddUser with correct values', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub,
      } = makeSut();

      jest.clearAllMocks();

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce(() => new Promise((resolve) => resolve(makeFakeUser())));

      await signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub);

      expect(DbAddUser).toHaveBeenCalledTimes(1);
      expect(DbAddUser).toHaveBeenCalledWith(
        hasherStub,
        addUserRepositoryStub,
        uuidV4Stub,
      );
    });

    test('Should call DbAddUser add with correct values', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub,
      } = makeSut();

      const addSpy = jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce(() => new Promise((resolve) => resolve(makeFakeUser())));

      await signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub);

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
        deleteUserByIdRepositoryStub,
      } = makeSut();

      const sendEmailSpy = jest.spyOn(senderMailStub, 'sendMail');


      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce(() => new Promise((resolve) => resolve(makeFakeUser())));

      await signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub);

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

    test('Should call deleteById user if SendEmail fails', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub,
      } = makeSut();

      jest.spyOn(DbAddUser.prototype, 'add')
        .mockImplementationOnce(() => new Promise((resolve) => resolve(makeFakeUser())));

      jest.spyOn(senderMailStub, 'sendMail').mockResolvedValueOnce(new Promise((resolve, reject) => reject()));

      const deleteSpy = jest.spyOn(deleteUserByIdRepositoryStub, 'deleteById');

      try {
        await signupService.add(makeFakeUserData(),
          addUserRepositoryStub,
          hasherStub,
          uuidV4Stub,
          configStub,
          senderMailStub,
          deleteUserByIdRepositoryStub);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    test('Should throws error if AddUser fails', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub,
      } = makeSut();


      jest.spyOn(DbAddUser.prototype, 'add')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

      const promise = signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub);

      await expect(promise).rejects.toThrow();
    });

    test('Should throws error if SendEmail fails', async () => {
      const {
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub,
      } = makeSut();


      jest.spyOn(senderMailStub, 'sendMail')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

      const promise = signupService.add(makeFakeUserData(),
        addUserRepositoryStub,
        hasherStub,
        uuidV4Stub,
        configStub,
        senderMailStub,
        deleteUserByIdRepositoryStub);

      await expect(promise).rejects.toThrow();
    });
  });
});
