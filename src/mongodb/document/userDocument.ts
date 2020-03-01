import mongoose from "mongoose";
import { Double } from "mongodb";

export interface IUserFilter {
  id?: string;
  name?: string;
  role?: string;
}

export interface IUser {
  id?: string;
  name?: string;
  role?: string;
  accessToken?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenType?: string;
  googleIdToken?: string;
  googleScope?: string;
  updatedAt?: Double;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findUser(wheres: IUserFilter): IUser;
}

export default interface IUserDocument extends mongoose.Document {
  id: string;
  name: string;
  role: string;
  accessToken: string;
  googleAccessToken: string;
  googleRefreshToken: string;
  googleTokenType: string;
  googleIdToken: string;
  googleScope: string;
  updatedAt: Double;
}
