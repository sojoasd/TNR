import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import { GOOGLE_API_URI } from "../enum/apiUri";
import AppError from "../model/appError";
import { IContext } from "./../model/request";
import logger from "../utility/logger";
import HttpHelper from "../utility/httpHelper";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";
import { AxiosRequestConfig } from "axios";
import { IUserFilter } from "../mongodb/document/userDocument";

export default class PhotoService {
  static async albums(context: IContext, body: any) {
    const fn = "PhotoService.albums";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      const loginUser = context.loginUser;
      const filter: IUserFilter = { id: loginUser.id };
      const user = await UserDBHelper.find(filter);

      const requestAlbums: AxiosRequestConfig = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.googleAccessToken}`
        },
        url: GOOGLE_API_URI.GET_ALBUMS_URI,
        responseType: "json"
      };
      const result = await HttpHelper.requestAction(requestAlbums);
      logger.debug(fn, { inputs, user, result });

      return result;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}
