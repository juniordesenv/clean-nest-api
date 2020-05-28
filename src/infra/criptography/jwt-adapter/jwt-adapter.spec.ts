import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => new Promise((resolve) => resolve('any_token')),
  verify: async (): Promise<any> => new Promise((resolve) => resolve({ _id: 'any_id' })),
}));

const makeSut = (): JwtAdapter => new JwtAdapter('secret');

describe('JWT Adapter', () => {
  test('Shoud call sign with correct', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_id');
    expect(signSpy).toHaveBeenCalledWith({ _id: 'any_id' }, 'secret');
  });

  test('Shoud return a token on sign success', async () => {
    const sut = makeSut();
    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });

  test('Shoud throw if sign throws', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.encrypt('any_id');
    expect(promise).rejects.toThrow();
  });

  test('Shoud call verify with correct', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'verify');
    await sut.decrypt('any_token');
    expect(signSpy).toHaveBeenCalledWith('any_token', 'secret');
  });

  test('Shoud return data on verify success', async () => {
    const sut = makeSut();
    const result = await sut.decrypt('any_token');
    expect(result).toEqual({ _id: 'any_id' });
  });

  test('Shoud throw if verify throws', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.decrypt('any_token');
    expect(promise).rejects.toThrow();
  });
});
