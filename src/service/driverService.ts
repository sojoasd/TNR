import env from "../utility/env";
import HTTP_STATUS from "../enum/httpStatus";
import AppError from "../model/appError";
import { IContext, ILoginUser } from "./../model/request";
import logger from "../utility/logger";
import UserDBHelper from "../mongodb/DBHelper/userDBHelper";
import FileDBHelper from "../mongodb/DBHelper/fileDBHelper";
import { google } from "googleapis";
import { IUserFilter } from "../mongodb/document/userDocument";
import { AxiosRequestConfig } from "axios";
import HttpHelper from "../utility/httpHelper";
import exif from "exif-parser";
import { GOOGLE_API_URI } from "../enum/apiUri";
import { IDownloadInput, IFileListCheckWithDB } from "../model/common";
import { IDriverFileIds, IDriverFileQuery, IDriverFolderQuery } from "../model/google";
import { isObjectEmpty } from "../utility/common";
import { IFile, IFileFilter } from "../mongodb/document/fileDocument";
import { ORDER_BY } from "../enum/common";
import { OAuth2Client } from "googleapis-common";

const clientId = env.GOOGLE_API_CONFIG.CLIENT_ID;
const clientSecret = env.GOOGLE_API_CONFIG.CLIENT_SECRET;
const redirectUri = env.GOOGLE_API_CONFIG.REDIRECT_URI;
const FOLDER_KEYWORD = env.GOOGLE_API_CONFIG.FOLDER_DEFAULT_KEYWORD;

export default class DriverService {
  static async getOauthClient(loginUser: ILoginUser): Promise<OAuth2Client> {
    const fn = "DriverService.getOauthClient";
    try {
      logger.debug(fn, { loginUser });

      const filter: IUserFilter = { id: loginUser.id };
      const user = await UserDBHelper.find(filter);
      logger.debug(fn, { loginUser, user });

      const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      await oAuth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
        token_type: user.googleTokenType,
        id_token: user.googleIdToken
      });

      return oAuth2Client;
    } catch (error) {
      logger.error(fn, { loginUser, msg: error.message });
      throw error;
    }
  }

  static async folders(context: IContext, body: IDriverFolderQuery) {
    const fn = "DriverService.folders";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      const oAuth2Client = await DriverService.getOauthClient(context.loginUser);

      const drive = google.drive({ version: "v3", auth: oAuth2Client });

      const orderBy = body.orderby === ORDER_BY.ASC ? "modifiedTime desc" : "modifiedTime";
      let params = { q: "mimeType='application/vnd.google-apps.folder'", orderBy };

      if (Object.keys(body).length === 0) {
        // params.q += ` and name contains '${FOLDER_KEYWORD}'`;
      } else {
        if (body.folderId) {
          const res = await drive.files.get({ fileId: body.folderId });
          logger.debug(fn, { folders: res.data, inputs });
          return res.data;
        }

        if (body.keyword) {
          params.q += ` and name contains '${body.keyword}'`;
        }
      }

      logger.debug(`${fn} params`, { inputs, params });

      const res = await drive.files.list(params);
      logger.debug(fn, { folders: res.data.files, inputs });

      return res.data.files;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  static async files(context: IContext, body: IDriverFileQuery): Promise<IFileListCheckWithDB[]> {
    const fn = "DriverService.files";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      const oAuth2Client = await DriverService.getOauthClient(context.loginUser);

      const folderId = context.urlQueryParams["folderId"] || body.folderId;

      const drive = google.drive({ version: "v3", auth: oAuth2Client });
      const params = { q: `'${folderId}' in parents and mimeType='image/jpeg'`, orderBy: "modifiedTime" };
      const res = await drive.files.list(params);
      logger.debug(fn, { folders: res.data.files, inputs });

      //   const fileIds = res.data.files.map(f => f.id);
      //   const files: IDriverFileIds = { fileIds: fileIds, folderId: body.folderId };
      //   console.log("counts", files.fileIds.length);
      //   const sss = await DriverService.importFiles(context, files);
      //   console.log(sss);
      const filter: IFileFilter = { folderId: folderId };
      const dbData = await FileDBHelper.findList(filter);

      // console.log(fn, dbData);

      const fileListCheckWithDB: IFileListCheckWithDB[] = [];

      res.data.files.map(m => {
        const isDBExist = dbData.some(s => s.id === m.id);

        fileListCheckWithDB.push({
          id: m.id,
          fileName: m.name,
          isDBExist: dbData.some(s => s.id === m.id),
          fileInfo: isDBExist ? dbData.find(f => f.id === m.id) : null
        });
      });

      return fileListCheckWithDB;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  static async importFiles(context: IContext, body: IDriverFileIds): Promise<IFile[]> {
    const fn = "DriverService.importFiles";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      // if (body.fileIds.length > 20) throw new Error("image counts be less than 21");

      const oAuth2Client = await DriverService.getOauthClient(context.loginUser);

      //重新取得 folder 底下所有 file info
      const folerQuery: IDriverFileQuery = { folderId: body.folderId };
      const fileList = await DriverService.files(context, folerQuery);
      logger.debug(`${fn} fileList`, fileList);

      const fileMetadataAry = await Promise.all(
        body.fileIds.map(async fileId => {
          try {
            //DB exist, don't insert
            if (fileList.some(s => s.id === fileId && s.isDBExist)) return;

            const fileName = fileList.find(f => f.id === fileId).fileName;

            const downloadInput: IDownloadInput = {
              googleAccessToken: oAuth2Client.credentials.access_token,
              folderId: body.folderId,
              fileId: fileId,
              fileName: fileName
            };
            const metaData = await DriverService.downloadFile(oAuth2Client, downloadInput);
            await FileDBHelper.insert(metaData);

            return metaData;
          } catch (error) {
            logger.debug(`${fn}, fileId: ${fileId}`, { msg: error.message });
          }
        })
      );

      return fileMetadataAry;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw new AppError(error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  static async downloadFile(oAuth2Client: OAuth2Client, downloadInput: IDownloadInput): Promise<IFile> {
    const fn = "DriverService.importFiles";
    const inputs = { downloadInput };

    try {
      logger.debug(fn, inputs);

      const requestPhoto: AxiosRequestConfig = {
        url: `${GOOGLE_API_URI.GET_FILE_URI}/${downloadInput.fileId}?alt=media`,
        method: "GET",
        headers: {
          "Accept-Encoding": "gzip",
          "User-Agent": "google-api-nodejs-client/3.2.1 (gzip)",
          Authorization: `Bearer ${oAuth2Client.credentials.access_token}`,
          Accept: "application/json"
        },
        params: { alt: "media" },
        responseType: "arraybuffer"
      };

      logger.debug(fn, { inputs, requestPhoto });

      const buffer = await HttpHelper.requestAction(requestPhoto);
      const parser = exif.create(buffer);
      const result = parser.parse();
      const fileMetadata: IFile = {
        id: downloadInput.fileId,
        folderId: downloadInput.folderId,
        fileName: downloadInput.fileName,
        latitude: result.tags.GPSLatitude ? result.tags.GPSLatitude : 0.0,
        longitude: result.tags.GPSLongitude ? result.tags.GPSLongitude : 0.0,
        createEpochDate: result.tags.CreateDate ? result.tags.CreateDate : +new Date()
      };

      return fileMetadata;
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw error;
    }
  }

  static async update(context: IContext, body: IFile): Promise<void> {
    const fn = "DriverService.update";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);

      const filter: IFileFilter = { id: body.id };
      delete body.id;

      body.updateEpochDate = +new Date();

      await FileDBHelper.update(filter, body);
      logger.debug(`${fn} ok`, inputs);
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw error;
    }
  }

  static async delete(context: IContext, body: IDriverFileIds): Promise<void> {
    const fn = "DriverService.delete";
    const inputs = { context, body };

    try {
      logger.debug(fn, inputs);
      const params = context.urlQueryParams;

      const deleteIds = Object.keys(params).map(m => {
        return params[m];
      });

      await FileDBHelper.delete(deleteIds);

      logger.debug(`${fn} ok`, inputs);
    } catch (error) {
      logger.error(fn, { inputs, msg: error.message });
      throw error;
    }
  }
}
