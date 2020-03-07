import logger from "../../utility/logger";
import mongoose from "mongoose";
import IFileDocument, { IFile, IFileFilter, IFileModel } from "../document/fileDocument";
import DB_TABLE from "../../model/table";

const FileSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    folderId: {
      type: String,
      index: true,
      required: true
    },
    fileName: {
      type: String,
      index: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    isPending: {
      type: Boolean,
      index: true
    },
    isStray: {
      type: Boolean
    },
    isNoDog: {
      type: Boolean
    },
    isChained: {
      type: Boolean
    },
    uncertainCount: {
      type: Number
    },
    notNeuteredCount: {
      type: Number
    },
    neuteredCount: {
      type: Number
    },
    maleDogCount: {
      type: Number
    },
    description: {
      type: String
    },
    contact: {
      type: String
    },
    createEpochDate: {
      type: Number,
      required: true
    },
    updateEpochDate: {
      type: Number
    }
  },
  {
    toObject: {
      transform(doc, ret): any {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    strict: false
  }
).static({
  async findPhotoList(wheres: IFileFilter): Promise<IFile[]> {
    const fn = "FileSchema.findPhotoList";

    logger.debug(fn, { wheres });
    const photos: Promise<IFileDocument[]> = await this.find(wheres, null);
    logger.debug(fn, { photos });

    return photos;
  }
});

export default function(conn: mongoose.Connection) {
  conn.db.admin().command({ setParameter: 1, failIndexKeyTooLong: false });
  return conn.model<IFileDocument, IFileModel>(DB_TABLE.File, FileSchema);
}
