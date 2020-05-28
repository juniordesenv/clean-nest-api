// eslint-disable-next-line max-classes-per-file
import { HashComparer } from '~/data/interfaces/cryptography/hash-comparer.interface';
import { User } from '~/infra/db/mongodb/models/user.model';
import { LoadUserByEmailOrUsernameRepository } from '~/data/interfaces/db/user/load-user-by-email-or-username-repository';
import { DbLoginUser } from '~/data/usecases/user/db-login-user';
import { Encrypter } from '~/data/interfaces/cryptography/encrypter.interface';


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

const makeFakeLogin = (): any => ({
  username: 'any_email@mail.com',
  password: 'any_password',
});

const makeFakeUserData = (): User => ({
  _id: 'any_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  username: 'valid_username',
  verifiedEmail: false,
  confirmToken: 'any_token',
});

const makeLoadUserByEmailOrUsernameRepository = (): LoadUserByEmailOrUsernameRepository => {
  class LoadUserByEmailOrUsernameRepositoryStub implements LoadUserByEmailOrUsernameRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async loadByEmailOrUsername(emailOrUsername: string): Promise<any> {
      const user: User = makeFakeUserData();
      return new Promise((resolve) => resolve(user));
    }
  }
  return new LoadUserByEmailOrUsernameRepositoryStub();
};


interface SutTypes {
  sut: DbLoginUser,
  hashComparerStub: HashComparer,
  encrypterStub: Encrypter,
  loadAccountByEmailRepositoryStub: LoadUserByEmailOrUsernameRepository
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const loadAccountByEmailRepositoryStub = makeLoadUserByEmailOrUsernameRepository();
  const sut = new DbLoginUser(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub);
  return {
    sut,
    hashComparerStub,
    encrypterStub,
    loadAccountByEmailRepositoryStub,
  };
};


describe('DbLoginUser Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmailOrUsername');

    await sut.login(makeFakeLogin());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmailOrUsername').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.login(makeFakeLogin());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmailOrUsername').mockReturnValueOnce(null);

    const accessToken = await sut.login(makeFakeLogin());

    expect(accessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.login(makeFakeLogin());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.login(makeFakeLogin());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const accessToken = await sut.login(makeFakeLogin());

    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.login(makeFakeLogin());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.login(makeFakeLogin());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut } = makeSut();

    const resultLogin = await sut.login(makeFakeLogin());

    expect(resultLogin.accessToken).toBe('any_token');
  });
});
