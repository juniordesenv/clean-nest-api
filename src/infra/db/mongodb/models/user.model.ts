import { prop } from '@typegoose/typegoose';
import { UserModel } from '~/domain/models/user.interface';

export class User implements UserModel {
  _id?: string;

  @prop({ required: true })
  name!: string;


  @prop({
    required: true,
    lowercase: true,
    unique: true,
  })
  username!: string;

  @prop({
    required: true,
    lowercase: true,
    email: true,
    trim: true,
    unique: true,
  })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true })
  verifiedEmail: boolean;

  @prop({ required: true })
  confirmToken: string;
}
