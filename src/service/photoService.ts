import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import { GOOGLE_API_URI } from "../enum/apiUri";
import AppError from "../model/appError";
import { IContext } from "./../model/request";
import logger from "../utility/logger";
import HttpHelper from "../utility/httpHelper";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";
import { AxiosRequestConfig } from "axios";
import { IUserFilter } from "../mongodb/document/userDocument";
import exif from "exif-parser";
import fs from "fs";

export default class PhotoService {
  static async albums(context: IContext, body: any) {
    const fn = "PhotoService.albums";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      const loginUser = context.loginUser;
      const filter: IUserFilter = { id: loginUser.id };
      const user = await UserDBHelper.find(filter);

      const requestAlbums: AxiosRequestConfig = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.googleAccessToken}`
        },
        url: GOOGLE_API_URI.GET_ALBUMS_URI,
        responseType: "json"
      };
      const result = await HttpHelper.requestAction(requestAlbums);
      logger.debug(fn, { inputs, user, result });

      return result;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  static async importAlbum() {
    // axios
    //   .get(
    //     "https://lh3.googleusercontent.com/lr/AGWb-e67Qe1vj05tjOFNWmF6ZZO1W1LayD5_Zh24j7U3m9e4fpNeF8XqmF4TpkveH0a8YLJmzYU0FJj3uuUOFj6JV08OwQQ7czYwyiG_v9VJ5TteIFazyniNtcywV8m1WkyH657Uhnx-Rm5HKSdEzK7UDK6wOhk0dx1rXiOHrcw0IuKxd40llyOAk8Kf0Wq0zp37GR_xSJF4bmQp9BUM7dt7lWgK2U9lcwJU3pEXQs3vLne8cp4pa-W9vA5oK9kjcjpgHpZtumb16hBYf6qBpJxA1W4OXRC7jkunpM3tJ77UwarRU4v837RaTsHszS5ByB0jFh5eZy2lERx931mUH9qBrYcIrQInH_S0J9Ra1_fa3VPC5RKrx2b2WoSGxGkFnEZYKsT1ZEa5vylRQi5nqFh1ah_LMskLO7PXfeYom45lG7ioH49si84Jx5oKNX-wSWM7fwzgbdSvFWwkvNLcxgQKkklG7Ite6HslLRV2RoGG-llqtdpAXJQ0cOW6glLtaAkXe1h5Lr_S2WQlqdlOswaU-6PfUyc7pbfs2t3V0SyE6gIcn6O0lFP5GEhMaQ2jsx7NUjVEYoVrMtF96hBp94JoV7TnQASZYibWY9d5fdEEtXopf5nUY247nGe_u2gNStmDMry-imToRkpTYPBgpcRMEFVfxbl2u91MsdgjNgRWIUFIrDOV8_kwDow3fBX7Fo4XN0PBZpVm_WoKqaULpsyn8__4PhFzeh_Vmkq7IJ9A2490BGylRySqr9Bcchcybt94gjkoYBm1ouI1-45OeMKpQgVqXCyTsW-D7w9aLMsHei5crxd6Ypw?.jpg",
    //     {
    //       responseType: "arraybuffer"
    //     }
    //   )
    //   .then(response => console.log(response.data));

    // const buffer = fs.readFileSync(__dirname + "/IMG_7306.JPG");
    const url =
      "https://lh3.googleusercontent.com/lr/AGWb-e5CmxHPduEvtxu3uwZCHmaQIVMqCA2DZSsGbzkppGFfFhEjzAhP7pwYmg7jZGsLxaNBQYoyguoNbSHtbdl0sbQE4hE5zax_j1pywo0M7BimldvXUFf2A0jlUuM7HnkNWgw1pkiJ1yd-Z0cc3RcZgA7drUZqKIYtrxXPCQgSzczs9d9P10QFFVkXWUZ5K6Hl5WgtEPs5TTHx_36z9sIwgvQWDCl5hkl5fY8rxVX_XJ2-hmw2ZFavP0gwsvOrpi2I_LJ1OjbC89IO7_peo5rHrS7KaDCv4cckmX4k_BFIESjHRDOnrSTEe8ZbZwDkNRagqyxINm4TzwxlOMS15OzU6KsZOlgRfwPgMpgBRKVHqGcQIWMHUJGPOHxghF6pWPr2GBbg__DkPRsc29EUf7aG1-WZdgaXxuMTjzQ9QXwQe6nNvLpiD-8iyu7WseutGeFp7LwZD89DtgQXturmlHM6jXlR-0zjZjxNVPgA-5VUZBR6AAGP1E0ieiuNuBR0l41isWboOklaz3mTQe8zOg4ueetI9gFkoAPSZ5GoUcZ__grAKA9LsJjDBn_xm9i-92k3E9BmYc0VoSIFwRn0WrWJCRhhecUsQ8zIsuwwQYXm3GWkyRAw6ti8G18Maj_Of7iUwTG08ly1l6VLveKQY-mV_TlOGkROml46YEa_ZazFf0z5jHGYJmF_1ZFAPdzR-EH1yBuxmUxhY2rhTrutrf4tJZ0kgv9YfFWlhWylkMps75YH3HYywqPrM3L733FQJa6Nt-gra398B_wAyRr1cDeocxWssCh55iMbBEOszqgHWoqATo5V28k";

    const requestPhoto: AxiosRequestConfig = {
      method: "GET",
      url: url,
      responseType: "arraybuffer"
    };

    const buffer = await HttpHelper.requestAction(requestPhoto);
    console.log("buffer: ", buffer);
    const parser = exif.create(buffer);
    const result = parser.parse();

    console.log("result: ", result);
  }
}
