import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddUserModel } from '~/domain/usecases/user/add-user.interface';
import { IsEqualTo } from '~/presentation/validators/is-equal-to';

export class AddUserDto implements AddUserModel {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirmation: string;

  verifiedEmail?: boolean;

  confirmToken?: string;
}
