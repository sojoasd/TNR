import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import AppError from "../model/appError";
import logger from "../utility/logger";
import CryptrHelper from "../utility/cryptrHelper";
import { ROLE } from "../enum/user";
import { IRegister, ILogin } from "../model/request";
import { v4 as uuidv4 } from "uuid";
import Jwt from "jsonwebtoken";
import { IUser, IUserFilter } from "../mongodb/document/userDocument";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";

export default class UserService {
  static async register(req: IRegister) {
    const fn = "UserService.register";

    try {
      logger.debug(fn, { req });

      const userInfo: IUser = {
        id: uuidv4(),
        name: req.name,
        account: req.account,
        role: ROLE.USER,
        password: CryptrHelper.encrypt(req.password),
        updatedAt: new Date()
      };

      const result = await UserDBHelper.insert(userInfo);
      logger.debug(fn, result);
      return result;
    } catch (error) {
      logger.error(fn, { msg: error.message, req });
      throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  static async login(req: ILogin): Promise<any> {
    const fn = "UserService.login";

    try {
      logger.debug(fn, { req });

      const filter: IUserFilter = { account: req.account };

      const user = await UserDBHelper.find(filter);
      logger.debug(fn, { user });

      if (!user) throw new Error("account not found");

      const password = CryptrHelper.decrypt(user.password);

      if (password !== req.password) throw new Error("password error");

      const jwtObj = {
        id: user.id,
        role: user.role
      };
      const token = Jwt.sign(jwtObj, env.TOKEN_SIGNATURE, { keyid: uuidv4(), expiresIn: env.TOKEN_EXP });

      logger.debug(fn, { req, jwtObj, user, token });

      const updateData: IUser = {
        token,
        updatedAt: new Date()
      };

      await UserDBHelper.update(filter, updateData);

      const now = new Date();

      return {
        id: user.id,
        name: user.name,
        token,
        expireEpochDate: now.setSeconds(now.getSeconds() + env.TOKEN_EXP)
      };
    } catch (error) {
      logger.error(fn, { msg: error.message, req });
      throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }
}
