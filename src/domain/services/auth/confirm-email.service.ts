import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';
import { ConfirmEmailUserRepository } from '~/data/interfaces/db/user/confirm-email-user-repository.interface';
import { DbConfirmEmailUser } from '~/data/usecases/user/db-confirm-email-user';

export class ConfirmEmailService {
  async confirmEmailByToken(
    confirmEmailUserData: ConfirmEmailUserModel,
    confirmEmailUserRepository: ConfirmEmailUserRepository,
  ) {
    const dbConfirmEmailUser = new DbConfirmEmailUser(confirmEmailUserRepository);
    return dbConfirmEmailUser.confirmEmailByToken(confirmEmailUserData);
  }
}
