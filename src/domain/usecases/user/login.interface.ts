export interface LoginModel {
  username: string;
  password: string;
}

export interface LoggedUserModel {
  accessToken: string;
}

export interface Login {
  login(loginData: LoginModel): Promise<LoggedUserModel>
}
