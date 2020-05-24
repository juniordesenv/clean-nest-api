export interface UserModel {
  _id?: string,
  name: string,
  email: string,
  password: string
  verifiedEmail: boolean;
  confirmToken: string;
}
