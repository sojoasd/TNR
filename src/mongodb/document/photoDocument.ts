import mongoose from "mongoose";
import { Double } from "mongodb";

export interface IPhotoFilter {
  id?: string;
  fileName?: string;
}

export interface IPhoto {
  id: string;
  folderId: string;
  fileName: string;
  latitude: number;
  longitude: number;
  createEpochDate: Double;
}

export interface IPhotoModel extends mongoose.Model<IPhotoDocument> {
  findPhoto(wheres: IPhotoFilter): IPhoto;
}

export default interface IPhotoDocument extends mongoose.Document {
  id: string;
  folderId: string;
  fileName: string;
  latitude: number;
  longitude: number;
  createEpochDate: Double;
}
