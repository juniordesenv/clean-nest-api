import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { UserModel } from '~/domain/models/user.interface';

export interface AddUserRepository {
  add(userData: AddUserDto): Promise<UserModel>
}
