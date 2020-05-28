// eslint-disable-next-line max-classes-per-file
import { DeleteUserByIdRepository } from '~/data/interfaces/db/user/delete-user-by-id-repository';
import { DbDeleteUser } from '~/data/usecases/user/db-delete-user';


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
  sut: DbDeleteUser,
  deleteUserByIdRepositoryStub: DeleteUserByIdRepository
}

const makeSut = (): SutTypes => {
  const deleteUserByIdRepositoryStub = makeDeleteUserByIdRepository();
  const sut = new DbDeleteUser(deleteUserByIdRepositoryStub);
  return {
    sut,
    deleteUserByIdRepositoryStub,
  };
};


describe('DbDeleteUser Usecase', () => {
  test('Should call DeleteUserByIdRepository with correct id', async () => {
    const { sut, deleteUserByIdRepositoryStub } = makeSut();

    const deleteSpy = jest.spyOn(deleteUserByIdRepositoryStub, 'deleteById');

    await sut.delete('any_id');

    expect(deleteSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if DeleteUserByIdRepository throws', async () => {
    const { sut, deleteUserByIdRepositoryStub } = makeSut();

    jest.spyOn(deleteUserByIdRepositoryStub, 'deleteById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.delete('any_id');

    await expect(promise).rejects.toThrow();
  });

  test('Should return void if delete on success', async () => {
    const { sut } = makeSut();

    const promise = sut.delete('any_id');

    await expect(promise).resolves.not.toThrow();
  });
});
