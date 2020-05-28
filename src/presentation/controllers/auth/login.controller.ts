import {
  Controller, Post, Body, HttpException, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { UserMongoRepository } from '~/infra/db/mongodb/users/user-mongo.repository';
import { BcryptAdapter } from '~/infra/criptography/bcrypt-adapter/bcrypt.adapter';
import { LoginService } from '~/domain/services/auth/login.service';
import { LoginUserDto } from '~/domain/dto/user/login-user.dto';
import { JwtAdapter } from '~/infra/criptography/jwt-adapter/jwt-adapter';
import { LoggedUserDto } from '~/domain/dto/user/logged-user.dto';
import { LoggedUserModel } from '~/domain/usecases/user/login.interface';

@ApiTags('Auth')
@Controller()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly userMongoRepository: UserMongoRepository,
    private readonly configService: ConfigService,
  ) { }

  @Post('auth/login')
  @ApiResponse({ status: 201, type: LoggedUserDto })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async handle(@Body() loginUserDto: LoginUserDto): Promise<LoggedUserModel> {
    try {
      const bcryptAdapter = new BcryptAdapter(12);
      const jwtAdapter = new JwtAdapter(this.configService.get<string>('SECRET'));
      return await this.loginService.login(
        loginUserDto,
        this.userMongoRepository,
        bcryptAdapter,
        jwtAdapter,
      );
    } catch (err) {
      throw new HttpException('Erro inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
