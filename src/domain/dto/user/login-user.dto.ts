import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginModel } from '~/domain/usecases/user/login.interface';

export class LoginUserDto implements LoginModel {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
