import { UserModel } from '~/domain/models/user.interface';

export interface LoadUserByEmailOrUsernameRepository {
  loadByEmailOrUsername(emailOrUsername: string): Promise<UserModel>
}
