import { HashComparer } from '~/data/interfaces/cryptography/hash-comparer.interface';
import { LoggedUserModel, Login, LoginModel } from '~/domain/usecases/user/login.interface';
import { LoadUserByEmailOrUsernameRepository } from '~/data/interfaces/db/user/load-user-by-email-or-username-repository';
import { Encrypter } from '~/data/interfaces/cryptography/encrypter.interface';

export class DbLoginUser implements Login {
  constructor(
    private readonly loadAccountByEmailRepository: LoadUserByEmailOrUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async login(login: LoginModel): Promise<LoggedUserModel> {
    const user = await this.loadAccountByEmailRepository.loadByEmailOrUsername(login.username);
    if (user) {
      const isValid = await this.hashComparer.compare(login.password, user.password);
      if (isValid) {
        return {
          accessToken: await this.encrypter.encrypt(user._id),
        };
      }
    }
    return null;
  }
}
