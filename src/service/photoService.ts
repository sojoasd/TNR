import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import AppError from "../model/appError";
import { IContext } from "./../model/request";
import logger from "../utility/logger";
import HttpHelper from "../utility/httpHelper";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";
import { AxiosRequestConfig } from "axios";

export default class PhotoService {
  static async albums(context: IContext, body: any) {
    const fn = "PhotoService.albums";

    console.log(fn, { context, body });
  }
}
