import bcrypt from 'bcrypt';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { HashComparer } from '~/data/interfaces/cryptography/hash-comparer.interface';


export class BcryptAdapter implements Hasher, HashComparer {
  constructor(
    private readonly salt: number,
  ) { }

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return new Promise((resolve) => resolve(isValid));
  }
}
