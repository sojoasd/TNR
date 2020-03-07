import mongoose from "mongoose";
import { Double } from "mongodb";

export interface IFileFilter {
  id?: string;
  folderId?: string;
  fileName?: string;
  isPending?: boolean;
}

export interface IFile {
  id?: string;
  folderId?: string;
  fileName?: string;
  latitude?: number;
  longitude?: number;
  isPending?: boolean;
  isStray?: boolean;
  isNoDog?: boolean;
  isChained?: boolean;
  uncertainCount?: number;
  notNeuteredCount?: number;
  neuteredCount?: number;
  maleDogCount?: number;
  description?: string;
  contact?: string;
  createEpochDate?: Double;
  updateEpochDate?: Double;
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
  isPending: boolean;
  isStray: boolean;
  isNoDog: boolean;
  isChained: boolean;
  uncertainCount: number;
  notNeuteredCount: number;
  neuteredCount: number;
  maleDogCount: number;
  description: string;
  contact: string;
  createEpochDate: Double;
  updateEpochDate: Double;
}
