import { validate } from 'class-validator';
import { IsCNPJ } from './is-cnpj';

const makePersonValidator = () => {
  class Person {
    @IsCNPJ()
    cnpj: any;
  }
  return new Person();
};

const makeSut = () => makePersonValidator();

describe('Is CNPJ', () => {
  test('Should call validate of person and throw errors with invalid CNPJ', async () => {
    const sut = makeSut();
    sut.cnpj = '34564059000114';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('cnpj');
    expect(errors[0].constraints.isCNPJ).toBeTruthy();
  });

  test('Should call validate of person and throw errors if not CNPJ', async () => {
    const sut = makeSut();
    sut.cnpj = '';
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('cnpj');
    expect(errors[0].constraints.isCNPJ).toBeTruthy();
  });

  test('Should call validate of person and throw errors if not String', async () => {
    const sut = makeSut();
    sut.cnpj = 1234567;
    const errors = await validate(sut);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('cnpj');
    expect(errors[0].constraints.isCNPJ).toBeTruthy();
  });

  test('Should call validate of person and pass with valid CNPJ (With Special Char)', async () => {
    const sut = makeSut();
    sut.cnpj = '49.614.536/0001-96';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });

  test('Should call validate of person and pass with valid CNPJ', async () => {
    const sut = makeSut();
    sut.cnpj = '34564059000124';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });


  test('Should call validate of person and pass with valid CNPJ', async () => {
    const sut = makeSut();
    sut.cnpj = '43265856000100';
    const errors = await validate(sut);
    expect(errors.length).toEqual(0);
  });
});
