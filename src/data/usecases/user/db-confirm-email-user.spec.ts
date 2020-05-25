// eslint-disable-next-line max-classes-per-file
import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';
import { ConfirmEmailUserRepository } from '~/data/interfaces/db/user/confirm-email-user-repository.interface';
import { DbConfirmEmailUser } from '~/data/usecases/user/db-confirm-email-user';


const makeFakeUserData = (): ConfirmEmailUserModel => ({
  confirmToken: 'valid_token',
});

const makeConfirmEmailUserRepository = (): ConfirmEmailUserRepository => {
  class DbConfirmEmailUserRepositoryStub implements ConfirmEmailUserRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async confirmEmailByToken(confirmEmailData: ConfirmEmailUserModel): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new DbConfirmEmailUserRepositoryStub();
};


interface SutTypes {
  sut: DbConfirmEmailUser,
  confirmEmailUserRepositoryStub: ConfirmEmailUserRepository
}

const makeSut = (): SutTypes => {
  const confirmEmailUserRepositoryStub = makeConfirmEmailUserRepository();
  const sut = new DbConfirmEmailUser(confirmEmailUserRepositoryStub);
  return {
    sut,
    confirmEmailUserRepositoryStub,
  };
};


describe('DbConfirmEmailUser Usecase', () => {
  test('Should call AddUserRepository with correct values', async () => {
    const { sut, confirmEmailUserRepositoryStub } = makeSut();
    const confirmEmailSpy = jest.spyOn(confirmEmailUserRepositoryStub, 'confirmEmailByToken');

    await sut.confirmEmailByToken(makeFakeUserData());
    expect(confirmEmailSpy).toHaveBeenCalledWith({
      confirmToken: 'valid_token',
    });
  });

  test('Should throw if ConfirmEmailUserRepository throws', async () => {
    const { sut, confirmEmailUserRepositoryStub } = makeSut();
    jest.spyOn(confirmEmailUserRepositoryStub, 'confirmEmailByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.confirmEmailByToken(makeFakeUserData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return true on success', async () => {
    const { sut } = makeSut();

    const user = await sut.confirmEmailByToken(makeFakeUserData());
    expect(user).toEqual(true);
  });
});
