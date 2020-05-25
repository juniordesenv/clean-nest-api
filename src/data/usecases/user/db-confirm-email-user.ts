import { ConfirmEmailUserRepository } from '~/data/interfaces/db/user/confirm-email-user-repository.interface';
import { ConfirmEmailUser, ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';

export class DbConfirmEmailUser implements ConfirmEmailUser {
  constructor(
    private readonly confirmEmailUserRepository: ConfirmEmailUserRepository,
  ) {}

  async confirmEmailByToken(confirmEmailData: ConfirmEmailUserModel): Promise<boolean> {
    return this.confirmEmailUserRepository.confirmEmailByToken(confirmEmailData);
  }
}
