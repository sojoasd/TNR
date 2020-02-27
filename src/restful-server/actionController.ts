import logger from "./../utility/logger";

export default class ActionController {
  static callAsync(afunc: any) {
    return async (req: Request, res, next) => {
      const fn = "ActionController.callAsync";

      try {
        logger.debug(fn, { body: req.body });

        const result = await afunc(req.body);

        res.json(result);
      } catch (error) {
        logger.error(fn, { msg: error.message });
        return next(error);
      }
    };
  }
}
