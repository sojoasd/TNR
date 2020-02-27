import logger from "../../utility/logger";
import mongoose from "mongoose";
import IUserDocument, { IUserModel, IUserFilter, IUser } from "../document/userDocument";
import UserSchema from "../schema/userSchema";
import { clearModels } from "../clear";

export default class UserDBHelper {
  constructor() {}

  static async insert(userInfo: IUser): Promise<IUser[]> {
    const fn = "UserDBHelper.insert";

    try {
      logger.debug(fn, { userInfo });

      const userDB: IUserModel = UserSchema(mongoose.connection);
      let userResult = await userDB.create([userInfo]);

      logger.debug(fn, { userResult });

      return userResult[0].toObject();
    } catch (error) {
      logger.error(fn, { msg: error.message });
      throw error;
    }
  }

  static async find(filter: IUserFilter): Promise<IUser> {
    const fn = "UserDBHelper.find";

    try {
      logger.debug(fn, { filter });

      const userDB: IUserModel = UserSchema(mongoose.connection);
      let userResult = await userDB.findUser(filter);

      logger.debug(fn, { userResult });

      return userResult;
    } catch (error) {
      logger.error(fn, { msg: error.message });
      throw error;
    }
  }

  static async update(filter: IUserFilter, updateData: IUser): Promise<void> {
    const fn = "UserDBHelper.update";

    try {
      logger.debug(fn, { filter, updateData });
      const userDB: IUserModel = UserSchema(mongoose.connection);
      const result = await userDB.updateOne(filter, updateData, { upsert: true });
      logger.debug(fn, { result, filter, updateData });
    } catch (error) {
      logger.error(fn, { msg: error.message });
      throw error;
    }
  }
}
