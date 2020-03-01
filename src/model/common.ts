interface IMongoConfig {
  URI: string;
  AUTO_INDEX: boolean;
}

interface IPinoConfig {
  prettyPrint: boolean;
}

interface IGoogleApiConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
}

interface IEnvironment {
  PORT: number | string;
  PINO_CONFIG: IPinoConfig;
  MONGO_CONFIG: IMongoConfig;
  TOKEN_SIGNATURE: string;
  TOKEN_EXP: number;
  HASH_SECRET: string;
  GOOGLE_API_CONFIG: IGoogleApiConfig;
  GOOGLE_API_SCOPE: string[];
}

interface IDownloadInput {
  googleAccessToken: string;
  folderId: string;
  fileId: string;
  fileName: string;
}

interface IFileListCheckWithDB {
  id: string;
  fileName: string;
  isDBExist: boolean;
}

export { IEnvironment, IDownloadInput, IFileListCheckWithDB };
