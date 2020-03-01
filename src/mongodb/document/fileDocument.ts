import mongoose from "mongoose";
import { Double } from "mongodb";

export interface IFileFilter {
  id?: string;
  folderId?: string;
  fileName?: string;
}

export interface IFile {
  id: string;
  folderId: string;
  fileName: string;
  latitude: number;
  longitude: number;
  createEpochDate: Double;
}

export interface IFileModel extends mongoose.Model<IFileDocument> {
  findPhotoList(wheres: IFileFilter): IFile[];
}

export default interface IFileDocument extends mongoose.Document {
  id: string;
  folderId: string;
  fileName: string;
  latitude: number;
  longitude: number;
  createEpochDate: Double;
}
