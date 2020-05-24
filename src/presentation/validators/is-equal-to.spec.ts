import { IsString, validate } from 'class-validator';
import { IsEqualTo } from './is-equal-to';

const makeUserValidator = () => {
  class User {
    @IsString()
    password: string;

    @IsEqualTo('password')
    passwordConfirmation: string;
  }
  return new User();
};

const makeSut = () => makeUserValidator();

describe('Is Equal To', () => {
  test('Should call validate of user and throw errors with different passwords', async () => {
    const sut = makeSut();
    sut.password = '123456';
    sut.passwordConfirmation = '12345678';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('passwordConfirmation');
    expect(errors[0].constraints.isEqualTo).toBeTruthy();
  });


  test('Should call validate of user with correct passwords', async () => {
    const sut = makeSut();
    sut.password = '123456';
    sut.passwordConfirmation = '123456';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });
});
