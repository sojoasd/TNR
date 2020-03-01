import logger from "../../utility/logger";
import mongoose from "mongoose";
import { IPhoto, IPhotoFilter, IPhotoModel } from "../document/photoDocument";
import PhotoSchema from "../schema/photoSchema";

export default class PhotoDBHelper {
  constructor() {}

  static async insert(photoInfo: IPhoto): Promise<IPhoto[]> {
    const fn = "PhotoDBHelper.insert";

    try {
      logger.debug(fn, { photoInfo });

      const db: IPhotoModel = PhotoSchema(mongoose.connection);
      let result = await db.create([photoInfo]);
      logger.debug(fn, { result });

      return result[0].toObject();
    } catch (error) {
      logger.error(fn, { msg: error.message, photoInfo });
      throw error;
    }
  }

  static async find(filter: IPhotoFilter): Promise<IPhoto> {
    const fn = "PhotoDBHelper.find";

    try {
      logger.debug(fn, { filter });

      const db: IPhotoModel = PhotoSchema(mongoose.connection);
      let result = await db.findPhotoList(filter);
      logger.debug(fn, { result });

      return result[0];
    } catch (error) {
      logger.error(fn, { msg: error.message, filter });
      throw error;
    }
  }

  static async findList(filter: IPhotoFilter): Promise<IPhoto[]> {
    const fn = "PhotoDBHelper.findList";

    try {
      logger.debug(fn, { filter });

      const db: IPhotoModel = PhotoSchema(mongoose.connection);
      let result = await db.findPhotoList(filter);
      logger.debug(fn, { result });

      return result;
    } catch (error) {
      logger.error(fn, { msg: error.message, filter });
      throw error;
    }
  }

  static async update(filter: IPhotoFilter, updateData: IPhoto): Promise<void> {
    const fn = "PhotoDBHelper.update";

    try {
      logger.debug(fn, { filter, updateData });

      const db: IPhotoModel = PhotoSchema(mongoose.connection);
      const result = await db.updateOne(filter, updateData, { upsert: true });
      logger.debug(fn, { result, filter, updateData });
    } catch (error) {
      logger.error(fn, { msg: error.message, filter, updateData });
      throw error;
    }
  }

  static async delete(fileIds: string[]): Promise<void> {
    const fn = "PhotoDBHelper.delete";

    try {
      logger.debug(fn, { fileIds });

      const condition = { id: { $in: fileIds } };

      const db: IPhotoModel = PhotoSchema(mongoose.connection);
      const result = await db.deleteMany(condition);
      logger.debug(fn, { result });
    } catch (error) {
      logger.error(fn, { msg: error.message, fileIds });
      throw error;
    }
  }
}
