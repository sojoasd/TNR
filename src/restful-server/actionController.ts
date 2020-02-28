import logger from "./../utility/logger";

export default class ActionController {
  static callAsync(afunc: any) {
    return async (req: Request, res, next) => {
      const fn = "ActionController.callAsync";

      try {
        // console.log(fn, req.url);

        const header = req.headers;
        const body = req.body;
        const url = req.url;

        logger.debug(fn, { url, header, body });

        const result = await afunc(url, header, body);

        res.json(result);
      } catch (error) {
        logger.error(fn, { msg: error.message });
        return next(error);
      }
    };
  }
}
