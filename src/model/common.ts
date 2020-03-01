import { Double } from "bson";

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

interface IFileMetadata {
  id: string; //file id
  fileName?: string;
  latitude: Double;
  longitude: Double;
  createEpochDate: number;
}

export { IEnvironment, IFileMetadata };
