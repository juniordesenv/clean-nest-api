// eslint-disable-next-line max-classes-per-file
import { DocumentType } from '@typegoose/typegoose';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { User } from '~/infra/db/mongodb/models/user.model';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { DbAddUser } from '~/data/usecases/user/db-add-user';


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
});

const makeFakeUserData = (): AddUserDto => ({
  name: 'valid_name',
  email: 'valid_email',
  username: 'valid_username',
  password: 'valid_password',
  passwordConfirmation: 'valid_password',
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
  sut: DbAddUser,
  hasherStub: Hasher,
  addUserRepositoryStub: AddUserRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addUserRepositoryStub = makeAddUserRepository();
  const uuidStub = makeUuidV4();
  const sut = new DbAddUser(hasherStub, addUserRepositoryStub, uuidStub);
  return {
    sut,
    hasherStub,
    addUserRepositoryStub,
  };
};


describe('DbAddUser Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(makeFakeUserData());
    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });


  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.add(makeFakeUserData());
    expect(promise).rejects.toThrow();
  });

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addUserRepositoryStub, 'add');

    await sut.add(makeFakeUserData());
    expect(addSpy).toHaveBeenCalledWith({
      confirmToken: 'any_value',
      verifiedEmail: false,
      name: 'valid_name',
      username: 'valid_username',
      email: 'valid_email',
      password: 'hashed_password',
      passwordConfirmation: 'valid_password',
    });
  });

  test('Should throw if AddUserRepository throws', async () => {
    const { sut, addUserRepositoryStub } = makeSut();
    jest.spyOn(addUserRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.add(makeFakeUserData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an user on success', async () => {
    const { sut } = makeSut();

    const user = await sut.add(makeFakeUserData());
    expect(user).toEqual(makeFakeUser());
  });
});
