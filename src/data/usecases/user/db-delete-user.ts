import { DeleteUser } from '~/domain/usecases/user/delete-user.interface';
import { DeleteUserByIdRepository } from '~/data/interfaces/db/user/delete-user-by-id-repository';

export class DbDeleteUser implements DeleteUser {
  constructor(
    private readonly deleteUserByIdRepository: DeleteUserByIdRepository,
  ) {}

  async delete(id: string): Promise<void> {
    await this.deleteUserByIdRepository.deleteById(id);
  }
}
