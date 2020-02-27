import mongoose from "mongoose";

export interface IUserFilter {
  id?: String;
  account?: string;
  password?: string;
  name?: string;
}

export interface IUser {
  id?: String;
  name?: string;
  account?: string;
  password?: string;
  role?: string;
  token?: string;
  updatedAt?: Date;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findUser(wheres: IUserFilter): IUser;
}

export default interface IUserDocument extends mongoose.Document {
  id: String;
  name: string;
  account: string;
  password: string;
  role: string;
  token: string;
  updatedAt: Date;
}
