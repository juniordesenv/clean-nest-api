import { DocumentType } from '@typegoose/typegoose';
import { User } from '~/infra/db/mongodb/models/user.model';

export interface LoadUserByEmailOrUsernameRepository {
  loadByEmailOrUsername(emailOrUsername: string): Promise<DocumentType<User>>
}
