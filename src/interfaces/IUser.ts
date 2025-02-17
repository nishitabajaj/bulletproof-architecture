export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  phone: number;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
