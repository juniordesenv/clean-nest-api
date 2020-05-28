import { UserModel } from '~/domain/models/user.interface';

export interface AddUserModel {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  confirmToken?: string;
  verifiedEmail?: false;
}

export interface AddUser {
  add(userData: AddUserModel): Promise<UserModel>
}
