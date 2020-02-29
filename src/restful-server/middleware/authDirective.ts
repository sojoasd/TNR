import env from "./../../utility/env";
import logger from "./../../utility/logger";
import HTTP_STATUS from "../../enum/httpStatus";
import ERROR_CODE from "../../enum/error";
import { ILoginUser } from "../../model/request";
import HttpErrorHandle from "http-errors";
import Jwt from "jsonwebtoken";
import UserService from "../../service/userService";

const authDirective = async (req: Request, res, next) => {
  const fn = "authDirective";

  const url = req.url;
  const body = req.body;
  const header = req.headers as any;
  const inputs = { url, body, header };

  try {
    logger.debug(fn, inputs);

    const { authorization } = header;

    const loginUser = Jwt.verify(authorization, env.TOKEN_SIGNATURE) as ILoginUser;
    logger.debug(fn, { inputs, loginUser });

    const now = +new Date();
    const diffSeconds = (now - loginUser.epochDate) / 1000 + 600; // default plus 600 seconds

    logger.debug(fn, { diffSeconds: `${diffSeconds} = (${now} - ${loginUser.epochDate})/1000 + 600`, inputs, loginUser });
    res.loginUser = loginUser;

    if (diffSeconds >= loginUser.googleTokenExpSeconds) {
      await UserService.refreshToken(loginUser);
      logger.debug(`${fn} refreshToken`, { inputs, loginUser, diffSeconds: `${diffSeconds} = (${now} - ${loginUser.epochDate})/1000 + 600` });
    }

    next();
  } catch (error) {
    logger.error(fn, { inputs, msg: error.message });
    return next(HttpErrorHandle(HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.INVALID_OAUTH_TOKEN));
  }
};

export { authDirective };
