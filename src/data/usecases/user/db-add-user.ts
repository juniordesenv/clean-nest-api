import { DocumentType } from '@typegoose/typegoose';
import { User } from '~/infra/db/mongodb/models/user.model';
import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { AddUser, AddUserModel } from '~/domain/usecases/user/add-user.interface';

export class DbAddUser implements AddUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository,
    private readonly uuid: UuidV4,
  ) {}

  async add(userData: AddUserModel): Promise<DocumentType<User>> {
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
