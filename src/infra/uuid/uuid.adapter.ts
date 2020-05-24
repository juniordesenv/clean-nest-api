import { v4 as uuidv4 } from 'uuid';

export class UuidAdapter implements UuidV4 {
  v4(): string {
    return uuidv4();
  }
}
