import logger from "./../utility/logger";
import { IContext } from "./../model/request";

export default class ActionController {
  static callAsync(afunc: any) {
    return async (req: Request, res, next) => {
      const fn = "ActionController.callAsync";

      try {
        const header = req.headers;
        const body = req.body;
        const url = req.url;

        logger.debug(fn, { url, header, body });

        const { loginUser } = res;
        const context: IContext = {
          url: url,
          loginUser: loginUser
        };

        logger.debug(fn, { url, header, body, context });

        const result = await afunc(context, body);

        res.json(result);
      } catch (error) {
        logger.error(fn, { msg: error.message });
        return next(error);
      }
    };
  }
}
