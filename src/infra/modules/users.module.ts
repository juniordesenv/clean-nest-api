import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserMongoRepository } from '~/infra/db/mongodb/users/user-mongo.repository';
import { User } from '~/infra/db/mongodb/models/user.model';
import { DbAddUser } from '~/data/usecases/user/db-add-user';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
  ],
  controllers: [],
  providers: [
    UserMongoRepository,
    DbAddUser,
  ],
  exports: [
    UserMongoRepository,
    DbAddUser,
  ],
})
export class UsersModule {}
