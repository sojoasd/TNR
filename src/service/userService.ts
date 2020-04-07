import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import AppError from "../model/appError";
import { IContext, ILoginUser, IClientLogin } from "./../model/request";
import { IGoogleAuthTokens, IGoogleProfile } from "../model/google";
import logger from "../utility/logger";
import HttpHelper from "../utility/httpHelper";
import { GOOGLE_API_URI } from "../enum/apiUri";
import { ROLE } from "../enum/user";
import { ILogin } from "../model/request";
import { v4 as uuidv4 } from "uuid";
import Jwt from "jsonwebtoken";
import { IUser, IUserFilter } from "../mongodb/document/userDocument";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";
import { google } from "googleapis";
import { AxiosRequestConfig } from "axios";

const clientId = env.GOOGLE_API_CONFIG.CLIENT_ID;
const clientSecret = env.GOOGLE_API_CONFIG.CLIENT_SECRET;
const redirectUri = env.GOOGLE_API_CONFIG.REDIRECT_URI;
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

export default class UserService {
  static login(context: IContext, body: ILogin): string {
    const fn = "UserService.login";
    const inputs = { context, body };
    logger.debug(fn, inputs);

    try {
      const tokenReq = {
        access_type: "offline",
        prompt: "consent", //一定會有 refresh token
        scope: env.GOOGLE_API_SCOPE.join(" ")
      };

      const authorizeUrl = oauth2Client.generateAuthUrl(tokenReq);

      logger.debug("authorizeUrl: ", { inputs, authorizeUrl });

      return authorizeUrl;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  static async afterLoginResponseToken(context: IContext, body: IClientLogin) {
    const fn = "UserService.afterLoginResponseToken";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      const reqText = `${body.code}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${redirectUri}`;

      const requestToken: AxiosRequestConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: GOOGLE_API_URI.GET_TOKEN_URI,
        data: reqText,
        responseType: "json"
      };
      const googleTokens = ((await HttpHelper.requestAction(requestToken)) as unknown) as IGoogleAuthTokens;

      logger.debug(fn, { inputs, requestToken, googleTokens });
      // console.log(fn, { inputs, requestToken, googleTokens });

      const requestProfile: AxiosRequestConfig = {
        method: "GET",
        url: GOOGLE_API_URI.GET_PROFILE_URI,
        params: {
          alt: "json",
          access_token: googleTokens.access_token
        },
        responseType: "json"
      };
      const profile = ((await HttpHelper.requestAction(requestProfile)) as unknown) as IGoogleProfile;

      logger.debug(fn, { inputs, requestProfile, profile });

      const now = new Date();

      const jwtObj: ILoginUser = {
        id: profile.id,
        role: ROLE.USER,
        name: profile.name,
        epochDate: +now,
        googleTokenExpSeconds: googleTokens.expires_in
      };

      const accessToken = Jwt.sign(jwtObj, env.TOKEN_SIGNATURE, { keyid: uuidv4(), expiresIn: env.TOKEN_EXP });

      const filter: IUserFilter = { id: profile.id };
      const user = await UserDBHelper.find(filter);

      logger.debug(fn, { inputs, filter, user });

      if (user) {
        const userInfo: IUser = {
          picture: profile.picture,
          accessToken: accessToken,
          googleAccessToken: googleTokens.access_token,
          googleRefreshToken: googleTokens.refresh_token,
          googleTokenType: googleTokens.token_type,
          googleIdToken: googleTokens.id_token,
          googleScope: googleTokens.scope,
          updatedAt: +new Date()
        };

        logger.debug(`${fn} UserDBHelper.update`, { inputs, userInfo });
        const result = await UserDBHelper.update(filter, userInfo);
        logger.debug(`${fn} UserDBHelper.update ok`, { inputs, userInfo, result });
      } else {
        const userInfo: IUser = {
          id: profile.id,
          name: profile.name,
          picture: profile.picture,
          role: ROLE.USER,
          accessToken: accessToken,
          googleAccessToken: googleTokens.access_token,
          googleRefreshToken: googleTokens.refresh_token,
          googleTokenType: googleTokens.token_type,
          googleIdToken: googleTokens.id_token,
          googleScope: googleTokens.scope,
          updatedAt: +new Date()
        };

        logger.debug(`${fn} UserDBHelper.insert`, { inputs, userInfo });
        const result = await UserDBHelper.insert(userInfo);
        logger.debug(`${fn} UserDBHelper.insert ok`, { inputs, userInfo, result });
      }

      return {
        id: profile.id,
        name: profile.name,
        picture: profile.picture,
        role: ROLE.USER,
        accessToken: accessToken,
        expireEpochDate: now.setSeconds(now.getSeconds() + env.TOKEN_EXP)
      };
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  static async refreshToken(loginUser: ILoginUser) {
    const fn = "UserService.refreshToken";

    try {
      logger.debug(fn, { loginUser });

      const filter: IUserFilter = { id: loginUser.id };
      const user = await UserDBHelper.find(filter);

      logger.debug(fn, { user, loginUser });

      await oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
        token_type: user.googleTokenType,
        id_token: user.googleIdToken
      });

      const refresh = await oauth2Client.refreshAccessToken();
      logger.debug(fn, { loginUser, user, refresh });

      const userInfo: IUser = {
        googleAccessToken: refresh.credentials.access_token,
        googleRefreshToken: refresh.credentials.refresh_token,
        googleTokenType: refresh.credentials.token_type,
        googleIdToken: refresh.credentials.id_token,
        updatedAt: +new Date()
      };

      const result = await UserDBHelper.update(filter, userInfo);
      logger.debug(fn, { loginUser, userInfo, result });
    } catch (error) {
      logger.error(fn, { loginUser, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }
}
