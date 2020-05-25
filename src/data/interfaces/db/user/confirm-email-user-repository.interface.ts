import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';

export interface ConfirmEmailUserRepository {
  confirmEmailByToken(confirmToken: ConfirmEmailUserModel): Promise<boolean>
}
