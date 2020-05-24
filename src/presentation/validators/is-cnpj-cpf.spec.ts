import { validate } from 'class-validator';
import { IsCPFCNPJ } from './is-cnpj-cpf';

const makePersonValidator = () => {
  class Person {
    @IsCPFCNPJ()
    document: string;
  }
  return new Person();
};

const makeSut = () => makePersonValidator();

describe('Is CNPJ/CPF', () => {
  test('Should call validate of person and throw errors with invalid CPF', async () => {
    const sut = makeSut();
    sut.document = '05344469013';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('document');
    expect(errors[0].constraints.isCPFCNPJ).toBeTruthy();
  });

  test('Should call validate of person and pass with valid CPF (With Special Char)', async () => {
    const sut = makeSut();
    sut.document = '005.397.070-58';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of person and pass with valid CPF', async () => {
    const sut = makeSut();
    sut.document = '05388469093';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of person and throw errors with invalid CNPJ', async () => {
    const sut = makeSut();
    sut.document = '34564059000114';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('document');
    expect(errors[0].constraints.isCPFCNPJ).toBeTruthy();
  });


  test('Should call validate of person and pass with valid CNPJ (With Special Char)', async () => {
    const sut = makeSut();
    sut.document = '49.614.536/0001-96';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of person and pass with valid CNPJ', async () => {
    const sut = makeSut();
    sut.document = '34564059000124';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });
});
