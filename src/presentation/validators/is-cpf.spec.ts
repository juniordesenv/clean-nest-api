import { validate } from 'class-validator';
import { IsCPF } from './is-cpf';

const makePersonValidator = () => {
  class Person {
    @IsCPF()
    cpf: string;
  }
  return new Person();
};

const makeSut = () => makePersonValidator();

describe('Is CPF', () => {
  test('Should call validate of person and throw errors with invalid CPF', async () => {
    const sut = makeSut();
    sut.cpf = '05344469013';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('cpf');
    expect(errors[0].constraints.isCPF).toBeTruthy();
  });

  test('Should call validate of person and throw errors if not CPF', async () => {
    const sut = makeSut();
    sut.cpf = '';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('cpf');
    expect(errors[0].constraints.isCPF).toBeTruthy();
  });

  test('Should call validate of person and pass with valid CPF (With Special Char)', async () => {
    const sut = makeSut();
    sut.cpf = '005.397.070-58';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of person and pass with valid CPF', async () => {
    const sut = makeSut();
    sut.cpf = '05388469093';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of person and pass with valid CPF', async () => {
    const sut = makeSut();
    sut.cpf = '36054626000';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });
});
