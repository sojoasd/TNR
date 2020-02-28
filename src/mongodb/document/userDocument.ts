import mongoose from "mongoose";

export interface IUserFilter {
  id?: String;
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
  updatedAt?: number;
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
  updatedAt: number;
}
