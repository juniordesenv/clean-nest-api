import { UserModel } from '~/domain/models/user.interface';

export interface LoadUserByIdRepository {
  loadById(id: string): Promise<UserModel>
}
