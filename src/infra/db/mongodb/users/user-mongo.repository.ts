import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { User } from '~/infra/db/mongodb/models/user.model';

export class UserMongoRepository implements AddUserRepository {
  constructor(@InjectModel('User') private userModel: ReturnModelType<typeof User>) {}

  async add(userData: AddUserDto): Promise<DocumentType<User>> {
    return this.userModel.create(userData);
  }
}
