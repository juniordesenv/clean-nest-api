import { HttpException, ValidationPipe } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ValidationPipe422 } from './validation-pipe';

class AddUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}


const makeSut = (): ValidationPipe => new ValidationPipe422();

describe('ValidationPipe422', () => {
  test('Should call transform function and throws UnprocessableEntityException if BadRequestException', async () => {
    const sut = makeSut();
    await expect(sut.transform({
      name: 'Test name',
      email: 'test',
    },
    {
      metatype: AddUserDto,
      type: 'body',
      data: undefined,
    })).rejects.toThrow(new Error('Unprocessable Entity Exception'));
  });

  test('Should call transform function and throws is not is BadRequestException', async () => {
    const sut = makeSut();

    jest.spyOn(ValidationPipe.prototype, 'transform').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    await expect(sut.transform({
      name: 'Test name',
      email: 'test',
    },
    {
      metatype: AddUserDto,
      type: 'body',
      data: undefined,
    })).rejects.toThrow(new Error());
  });


  test('Should call transform function and throws BadRequestException with Response String', async () => {
    const sut = makeSut();

    jest.spyOn(HttpException.prototype, 'getResponse').mockReturnValue('any message');

    await expect(sut.transform({
      name: 'Test name',
      email: 'test',
    },
    {
      metatype: AddUserDto,
      type: 'body',
      data: undefined,
    })).rejects.toThrow(new Error('any message'));
  });

  test('Should call transform function and throws BadRequestException with Response Message', async () => {
    const sut = makeSut();

    jest.spyOn(HttpException.prototype, 'getResponse').mockReturnValue({
      message: 'any message',
    });

    await expect(sut.transform({
      name: 'Test name',
      email: 'test',
    },
    {
      metatype: AddUserDto,
      type: 'body',
      data: undefined,
    })).rejects.toThrow(new Error('any message'));
  });
});
