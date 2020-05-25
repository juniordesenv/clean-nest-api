import {
  Controller, HttpException, HttpStatus, Param, Put,
} from '@nestjs/common';
import {
  ApiTags, ApiResponse,
} from '@nestjs/swagger';
import { UserMongoRepository } from '~/infra/db/mongodb/users/user-mongo.repository';
import { ConfirmEmailUserDto } from '~/domain/dto/user/confirm-email-user.dto';
import { ConfirmEmailService } from '~/domain/services/auth/confirm-email.service';

@ApiTags('Auth')
@Controller()
export class ConfirmEmailController {
  constructor(
    private readonly confirmEmailService: ConfirmEmailService,
    private readonly userMongoRepository: UserMongoRepository,
  ) { }

  @Put('auth/signup/confirm/:confirmToken')
  @ApiResponse({ status: 201, description: 'Email confirmado com sucesso!' })
  @ApiResponse({ status: 400, description: 'Token não encontrado!' })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async handle(@Param() confirmEmailUserDto: ConfirmEmailUserDto) {
    try {
      const isConfirmed = await this.confirmEmailService.confirmEmailByToken(
        confirmEmailUserDto,
        this.userMongoRepository,
      );
      if (!isConfirmed) throw new Error('invalidToken');
      return 'Email confirmado com sucesso!';
    } catch (err) {
      if (err.message === 'invalidToken') throw new HttpException('Token não encontrado!', HttpStatus.BAD_REQUEST);
      throw new HttpException('Erro inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
