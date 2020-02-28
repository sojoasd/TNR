import logger from "./logger";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class HttpHelper {
  static async requestAction(axiosRequest: AxiosRequestConfig): Promise<AxiosResponse> {
    const fn = "HttpHelper.requestAction";

    try {
      logger.debug(fn, { axiosRequest });
      const result: AxiosResponse = await axios(axiosRequest);
      logger.debug(`${fn} response`, { axiosRequest, result: result.data });

      return result.data;
    } catch (error) {
      logger.error(fn, { axiosRequest, msg: error.message });
      throw error;
    }
  }
}
