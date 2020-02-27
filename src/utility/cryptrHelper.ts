import env from "../utility/env";
import logger from "../utility/logger";
import Cryptr from "cryptr";

const cryptr = new Cryptr(env.HASH_SECRET);

export default class CryptrHelper {
  static encrypt(text: string): string {
    const fn = "CryptrHelper.encrypt";

    try {
      return cryptr.encrypt(text);
    } catch (error) {
      logger.error(fn, { msg: error.message });
      throw error;
    }
  }

  static decrypt(text: string): string {
    const fn = "CryptrHelper.decrypt";

    try {
      return cryptr.decrypt(text);
    } catch (error) {
      logger.error(fn, { msg: error.message });
      throw error;
    }
  }
}
