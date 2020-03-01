import logger from "../../utility/logger";
import mongoose from "mongoose";
import IPhotoDocument, { IPhoto, IPhotoFilter, IPhotoModel } from "../document/photoDocument";
import DB_TABLE from "../../model/table";

const PhotoSchema = new mongoose.Schema(
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
    createEpochDate: {
      type: Number,
      required: true
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
  async findPhotoList(wheres: IPhotoFilter): Promise<IPhoto[]> {
    const fn = "PhotoSchema.findPhotoList";

    logger.debug(fn, { wheres });
    const photos: Promise<IPhotoDocument[]> = await this.find(wheres, null);
    logger.debug(fn, { photos });

    return photos;
  }
});

export default function(conn: mongoose.Connection) {
  return conn.model<IPhotoDocument, IPhotoModel>(DB_TABLE.PHOTO, PhotoSchema);
}
