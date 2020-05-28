import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoggedUserModel } from '~/domain/usecases/user/login.interface';

export class LoggedUserDto implements LoggedUserModel {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;
}
