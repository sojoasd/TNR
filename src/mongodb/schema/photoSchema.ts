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
      index: true
    },
    fileName: {
      type: String,
      index: true
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
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
  async findPhoto(wheres: IPhotoFilter): Promise<IPhoto> {
    const fn = "PhotoSchema.findPhoto";

    logger.debug(fn, { wheres });
    const photos: Promise<IPhotoDocument[]> = await this.find(wheres, null);
    const photo = photos[0];
    logger.debug(fn, { photo });

    return photo;
  }
});

export default function(conn: mongoose.Connection) {
  return conn.model<IPhotoDocument, IPhotoModel>(DB_TABLE.PHOTO, PhotoSchema);
}
