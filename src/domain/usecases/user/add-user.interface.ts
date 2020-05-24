import { DocumentType } from '@typegoose/typegoose';
import { User } from '~/infra/db/mongodb/models/user.model';

export interface AddUserModel {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  confirmToken?: string;
}

export interface AddUser {
  add(userData: AddUserModel): Promise<DocumentType<User>>
}
