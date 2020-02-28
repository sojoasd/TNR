import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import AppError from "../model/appError";
import { IGoogleAuthTokens, IGoogleProfile } from "../model/google";
import logger from "../utility/logger";
import HttpHelper from "../utility/httpHelper";
import { ROLE } from "../enum/user";
import { ILogin } from "../model/request";
import { v4 as uuidv4 } from "uuid";
import Jwt from "jsonwebtoken";
import { IUser } from "../mongodb/document/userDocument";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";
import { google } from "googleapis";
import { AxiosRequestConfig } from "axios";

const clientId = env.GOOGLE_API_CONFIG.CLIENT_ID;
const clientSecret = env.GOOGLE_API_CONFIG.CLIENT_SECRET;
const redirectUri = env.GOOGLE_API_CONFIG.REDIRECT_URI;
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

export default class UserService {
  static login(url: string, header: Headers, body: ILogin): string {
    const fn = "UserService.login";
    const inputs = { url, header, body };
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

    // await oauth2Client.setCredentials({
    //   access_token: "ya29.Il_AByaOZjeOyC_MkXKohkr9qRdHpwOyZGKf5n1MhzJjW5v9U2NzSvTWGbbfxpJ0jRgOfwEO28ut_MCJYHTPFEm8epjsW5TpY5ujkqc-yQR3km4l9-sDMDZxfGDDquHQ8w",
    //   refresh_token: "1//0eVcSDu_U58cWCgYIARAAGA4SNwF-L9Ir57R7l-mTPK3xrB1RzbQzNDmVIP5w9TD5TLfJ1eFTm1EnHDtHgSZPENoe1aG1wSPpdvM",
    //   token_type: "Bearer",
    //   id_token:
    //     "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE3ZDU1ZmY0ZTEwOTkxZDZiMGVmZDM5MmI5MWEzM2U1NGMwZTIxOGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMTc1NDAxMjc5NjAtaXE5NDVwbXNmNGZkNmJxaXBrZjNqMTNrcWptZGd2cW8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMTc1NDAxMjc5NjAtaXE5NDVwbXNmNGZkNmJxaXBrZjNqMTNrcWptZGd2cW8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg1NjMwOTQ2ODk1Mjk5MDg1NjYiLCJhdF9oYXNoIjoiVTQ1SUlBUngyNzRDc1VMMFVwMUt2QSIsIm5hbWUiOiJaZWFsIFllbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLW5UVkFEcEoxWmNVL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FLRjA1bkJndFozZVB4b2F4aS1ZM3UxaTJaRTlibV9qWUEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlplYWwgIiwiZmFtaWx5X25hbWUiOiJZZW4iLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU4Mjg5NDI5MSwiZXhwIjoxNTgyODk3ODkxfQ.SRDxKKk_JUdelbTSc4zWfPnBkRvJjMi6YbkHXmS0MFt4_0igcBI_G8iw6O-IpCpVRfzSu-LMIFkncyRpThqkjDpBnJu7oh3uJp6Dyz1R19iTlbTsMtkmdQvhlaGMpYVimHKwsZx4f1OrgdflGDZ-5G5DfyMhwZqi-2hMY0okdWkxqK_btBDnNHuJwl5hXESY45BCzBgB5J4O-sj5UpLJjK1MzrESPdUIhGGhMLbXmoJmna6JNnsVG8y94zQjgG7ADgOp-qwfX7_JlICjO5CBf3QpZyK-8MRDgN_JRuZKy9bb_n_hN6A1EPPqQ3phW7uVB-lLJN4S1aZnH6JF7M_dww"
    // });

    // const sss = await oauth2Client.refreshAccessToken();
    // console.log({ sss });
  }

  static async afterLoginResponseToken(url: string, header: Headers, body: any) {
    const fn = "UserService.afterLoginResponseToken";
    const inputs = { url, header, body };
    logger.levelVal = 20;
    logger.debug(fn, inputs);

    try {
      const code = url.replace(/\/afterLoginResponseToken\?/g, "").split("&scope")[0];

      const reqText = `${code}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${redirectUri}`;

      // const { tokens } = await oauth2Client.getToken(code);
      // console.log(fn, { tokens });

      const requestToken: AxiosRequestConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: env.GOOGLE_API_CONFIG.GET_TOKEN_URI,
        data: reqText,
        responseType: "json"
      };
      const googleTokens = ((await HttpHelper.requestAction(requestToken)) as unknown) as IGoogleAuthTokens;

      logger.debug(fn, { inputs, requestToken, googleTokens });

      const requestProfile: AxiosRequestConfig = {
        method: "GET",
        url: env.GOOGLE_API_CONFIG.GET_PROFILE_URI,
        params: {
          alt: "json",
          access_token: googleTokens.access_token
        },
        responseType: "json"
      };
      const profile = ((await HttpHelper.requestAction(requestProfile)) as unknown) as IGoogleProfile;

      logger.debug(fn, { inputs, requestProfile, profile });

      const jwtObj = {
        id: profile.id,
        role: ROLE.USER
      };
      const accessToken = Jwt.sign(jwtObj, env.TOKEN_SIGNATURE, { keyid: uuidv4(), expiresIn: env.TOKEN_EXP });

      const userInfo: IUser = {
        id: profile.id,
        name: profile.name,
        role: ROLE.USER,
        accessToken: accessToken,
        googleAccessToken: googleTokens.access_token,
        googleRefreshToken: googleTokens.refresh_token,
        googleTokenType: googleTokens.token_type,
        googleIdToken: googleTokens.id_token,
        googleScope: googleTokens.scope,
        updatedAt: +new Date()
      };

      const result = await UserDBHelper.insert(userInfo);
      logger.debug(fn, { inputs, userInfo, result });

      const now = new Date();

      return {
        id: profile.id,
        name: profile.name,
        role: ROLE.USER,
        accessToken: accessToken,
        expireEpochDate: now.setSeconds(now.getSeconds() + env.TOKEN_EXP)
      };
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }
}
