import env from "./../../utility/env";
import logger from "./../../utility/logger";
import HTTP_STATUS from "../../enum/httpStatus";
import ERROR_CODE from "../../enum/error";
import { ILogin } from "../../model/request";
import HttpErrorHandle from "http-errors";
import Jwt from "jsonwebtoken";

const authDirective = async (req: Request, res, next) => {
  const fn = "authDirective";

  const url = req.url;
  const body = req.body;
  const header = req.headers as any;
  const inputs = { url, body, header };

  try {
    logger.debug(fn, inputs);

    const { authorization } = header;

    res.loginUser = Jwt.verify(authorization, env.TOKEN_SIGNATURE);

    next();
  } catch (error) {
    logger.error(fn, { inputs, msg: error.message });
    return next(HttpErrorHandle(HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.INVALID_OAUTH_TOKEN));
  }
};

export { authDirective };
