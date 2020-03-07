import mongoose from "mongoose";
import { Connection } from "mongoose";
import env from "./../utility/env";
import logger from "./../utility/logger";

class Mongodb {
  private static _instance: Mongodb;

  private constructor() {}

  static getInstance() {
    if (!Mongodb._instance) {
      Mongodb._instance = new Mongodb();
    }

    return Mongodb._instance;
  }

  async init(): Promise<void> {
    const fn = "Mongodb.init";
    logger.debug(fn, { config: env.MONGO_CONFIG });

    try {
      await mongoose.connect(env.MONGO_CONFIG.URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
      logger.info("DATABASE IS CONNECTED");
    } catch (error) {
      logger.error(fn, { msg: error.message });
    }
  }
}

const mongodb = Mongodb.getInstance();

export default mongodb;
