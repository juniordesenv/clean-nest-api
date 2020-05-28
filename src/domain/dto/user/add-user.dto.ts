import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AddUserModel } from '~/domain/usecases/user/add-user.interface';
import { IsEqualTo } from '~/presentation/validators/is-equal-to';

export class AddUserDto implements AddUserModel {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform((value: string) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform((value: string) => value.toLowerCase())
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirmation: string;

  verifiedEmail?: false;

  confirmToken?: string;
}
