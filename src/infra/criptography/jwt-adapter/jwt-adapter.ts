import jwt from 'jsonwebtoken';
import { Encrypter } from '~/data/interfaces/cryptography/encrypter.interface';
import { Decrypter } from '~/data/interfaces/cryptography/decrypter.interface';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ _id: value }, this.secret);
    return accessToken;
  }

  async decrypt(token: string): Promise<any> {
    return jwt.verify(token, this.secret);
  }
}
