import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';

export class ConfirmEmailUserDto implements ConfirmEmailUserModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  confirmToken: string;
}
