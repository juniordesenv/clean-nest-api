import { DocumentType } from '@typegoose/typegoose';
import { User } from '~/infra/db/mongodb/models/user.model';

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
  add(userData: AddUserModel): Promise<DocumentType<User>>
}
