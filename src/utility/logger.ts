import pino from "pino";

import env from "./../utility/env";

class Logger {
  private static _instance: Logger;

  static getInstance() {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    return Logger._instance;
  }

  createLogger() {
    let logger = pino(env.PINO_CONFIG);
    // logger.levelVal = 20;
    return logger;
  }
}

const loggers = Logger.getInstance();

export default loggers.createLogger();
