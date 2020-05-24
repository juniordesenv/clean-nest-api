import { IsNumberString, validate } from 'class-validator';
import { IsOptional } from './is-optional';

const makeUserValidator = () => {
  class User {
    @IsOptional()
    @IsNumberString()
    phone: string;
  }
  return new User();
};

const makeSut = () => makeUserValidator();

describe('Is Optional', () => {
  test('Should call validate of user with phone', async () => {
    const sut = makeSut();
    sut.phone = '9999999999';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });


  test('Should call validate of user with empty phone', async () => {
    const sut = makeSut();
    sut.phone = '';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of user and throw errors if incorrect phone', async () => {
    const sut = makeSut();
    sut.phone = '(45)9999999';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].constraints.isNumberString).toBeTruthy();
  });
});
