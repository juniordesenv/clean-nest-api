// eslint-disable-next-line max-classes-per-file
import { Test } from '@nestjs/testing';
import { AppModule } from '~/app.module';
import { ConfirmEmailUserRepository } from '~/data/interfaces/db/user/confirm-email-user-repository.interface';
import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';
import { ConfirmEmailService } from '~/domain/services/auth/confirm-email.service';
import { DbConfirmEmailUser } from '~/data/usecases/user/db-confirm-email-user';

jest.mock('../../../data/usecases/user/db-confirm-email-user');

const makeFakeConfirmEmailUserData = (): ConfirmEmailUserModel => ({
  confirmToken: 'valid_token',
});

const makeConfirmRepository = (): ConfirmEmailUserRepository => {
  class ConfirmEmailUserRepositoryStub implements ConfirmEmailUserRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async confirmEmailByToken(userData: ConfirmEmailUserModel): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new ConfirmEmailUserRepositoryStub();
};


interface SutTypes {
  confirmEmailUserRepositoryStub: ConfirmEmailUserRepository
}

const makeSut = (): SutTypes => {
  const confirmEmailUserRepositoryStub = makeConfirmRepository();
  return {
    confirmEmailUserRepositoryStub,
  };
};

describe('ConfirmEmailService', () => {
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

    confirmEmailService = moduleRef.get<ConfirmEmailService>(ConfirmEmailService);
  });


  describe('ConfirmEmail confirmEmailByToken', () => {
    test('Should call confirmEmailByToken with correct values and params', async () => {
      const {
        confirmEmailUserRepositoryStub,
      } = makeSut();
      const addSpy = jest.spyOn(confirmEmailService, 'confirmEmailByToken');

      jest.spyOn(DbConfirmEmailUser.prototype, 'confirmEmailByToken')
        .mockImplementationOnce(() => new Promise((resolve) => resolve(true)));

      await confirmEmailService.confirmEmailByToken(
        makeFakeConfirmEmailUserData(),
        confirmEmailUserRepositoryStub,
      );

      expect(addSpy).toHaveBeenCalledWith({
        confirmToken: 'valid_token',
      },
      confirmEmailUserRepositoryStub);
    });


    test('Should throws error if DbConfirmEmailUser fails', async () => {
      const {
        confirmEmailUserRepositoryStub,
      } = makeSut();


      jest.spyOn(DbConfirmEmailUser.prototype, 'confirmEmailByToken')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

      const promise = confirmEmailService.confirmEmailByToken(makeFakeConfirmEmailUserData(),
        confirmEmailUserRepositoryStub);

      await expect(promise).rejects.toThrow();
    });
  });
});
