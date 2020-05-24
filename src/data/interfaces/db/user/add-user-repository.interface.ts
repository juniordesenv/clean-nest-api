import { DocumentType } from '@typegoose/typegoose';
import { User } from '~/infra/db/mongodb/models/user.model';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';

export interface AddUserRepository {
  add(userData: AddUserDto): Promise<DocumentType<User>>
}
