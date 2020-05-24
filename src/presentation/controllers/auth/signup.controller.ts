import {
  Controller, Post, Body, HttpException, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { UserMongoRepository } from '~/infra/db/mongodb/users/user-mongo.repository';
import { SignupService } from '~/domain/services/auth/signup.service';
import { BcryptAdapter } from '~/infra/criptography/bcrypt-adapter/bcrypt.adapter';
import { ConfigAdapter } from '~/infra/config/config.adapter';
import { MailerAdapter } from '~/infra/mailer/mailer.adapter';
import { UuidAdapter } from '~/infra/uuid/uuid.adapter';

@ApiTags('Auth')
@Controller()
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly userMongoRepository: UserMongoRepository,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) { }

  @Post('auth/signup')
  @ApiResponse({ status: 201, description: 'Cadastro efetuado com sucesso!' })
  @ApiResponse({ status: 400, description: 'Email já cadastrado!' })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async handle(@Body() addUserDto: AddUserDto) {
    try {
      const bcryptAdapter = new BcryptAdapter(12);
      const mailerAdapter = new MailerAdapter(this.mailerService);
      const configAdapter = new ConfigAdapter(this.configService);
      const uuidAdapter = new UuidAdapter();
      await this.signupService.add(
        addUserDto,
        this.userMongoRepository,
        bcryptAdapter,
        uuidAdapter,
        configAdapter,
        mailerAdapter,
      );
      return 'Cadastro efetuado com sucesso!';
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Erro inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
