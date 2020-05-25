export interface ConfirmEmailUserModel {
  confirmToken: string;
}

export interface ConfirmEmailUser {
  confirmEmailByToken(confirmEmailData: ConfirmEmailUserModel): Promise<boolean>
}
