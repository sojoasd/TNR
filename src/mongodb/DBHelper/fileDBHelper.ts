import logger from "../../utility/logger";
import mongoose from "mongoose";
import { IFile, IFileFilter, IFileModel } from "../document/fileDocument";
import FileSchema from "../schema/fileSchema";

export default class FileDBHelper {
  constructor() {}

  static async insert(photoInfo: IFile): Promise<IFile[]> {
    const fn = "FileDBHelper.insert";

    try {
      logger.debug(fn, { photoInfo });

      const db: IFileModel = FileSchema(mongoose.connection);
      let result = await db.create([photoInfo]);
      logger.debug(fn, { result });

      return result[0].toObject();
    } catch (error) {
      logger.error(fn, { msg: error.message, photoInfo });
      throw error;
    }
  }

  static async find(filter: IFileFilter): Promise<IFile> {
    const fn = "FileDBHelper.find";

    try {
      logger.debug(fn, { filter });

      const db: IFileModel = FileSchema(mongoose.connection);
      let result = await db.findPhotoList(filter);
      logger.debug(fn, { result });

      return result[0];
    } catch (error) {
      logger.error(fn, { msg: error.message, filter });
      throw error;
    }
  }

  static async findList(filter: IFileFilter): Promise<IFile[]> {
    const fn = "FileDBHelper.findList";

    try {
      logger.debug(fn, { filter });

      const db: IFileModel = FileSchema(mongoose.connection);
      let result = await db.findPhotoList(filter);
      logger.debug(fn, { result });

      return result;
    } catch (error) {
      logger.error(fn, { msg: error.message, filter });
      throw error;
    }
  }

  static async update(filter: IFileFilter, updateData: IFile): Promise<void> {
    const fn = "FileDBHelper.update";

    try {
      logger.debug(fn, { filter, updateData });

      const db: IFileModel = FileSchema(mongoose.connection);
      const result = await db.updateOne(filter, updateData, { upsert: true });
      logger.debug(fn, { result, filter, updateData });
    } catch (error) {
      logger.error(fn, { msg: error.message, filter, updateData });
      throw error;
    }
  }

  static async delete(fileIds: string[]): Promise<void> {
    const fn = "FileDBHelper.delete";

    try {
      logger.debug(fn, { fileIds });

      const condition = { id: { $in: fileIds } };

      const db: IFileModel = FileSchema(mongoose.connection);
      const result = await db.deleteMany(condition);
      logger.debug(fn, { result });
    } catch (error) {
      logger.error(fn, { msg: error.message, fileIds });
      throw error;
    }
  }
}
