import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { AddUser, AddUserModel } from '~/domain/usecases/user/add-user.interface';
import { UserModel } from '~/domain/models/user.interface';

export class DbAddUser implements AddUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository,
    private readonly uuid: UuidV4,
  ) {}

  async add(userData: AddUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(userData.password);
    const confirmToken = this.uuid.v4();
    const user = await this.addUserRepository.add({
      ...userData,
      verifiedEmail: false,
      confirmToken,
      password: hashedPassword,
    });
    return user;
  }
}
