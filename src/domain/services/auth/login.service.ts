import { DbLoginUser } from '~/data/usecases/user/db-login-user';
import { LoadUserByEmailOrUsernameRepository } from '~/data/interfaces/db/user/load-user-by-email-or-username-repository';
import { HashComparer } from '~/data/interfaces/cryptography/hash-comparer.interface';
import { Encrypter } from '~/data/interfaces/cryptography/encrypter.interface';
import { LoginModel } from '~/domain/usecases/user/login.interface';

export class LoginService {
  async login(
    loginUserData: LoginModel,
    loadAccountByEmailRepository: LoadUserByEmailOrUsernameRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
  ) {
    const dbLoginUser = new DbLoginUser(loadAccountByEmailRepository, hashComparer, encrypter);
    return dbLoginUser.login(loginUserData);
  }
}
