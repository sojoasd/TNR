interface IMongoConfig {
  URI: string;
  AUTO_INDEX: boolean;
}

interface IPinoConfig {
  prettyPrint: boolean;
}

interface IEnvironment {
  PORT: number | string;
  PINO_CONFIG: IPinoConfig;
  MONGO_CONFIG: IMongoConfig;
  TOKEN_SIGNATURE: string;
  TOKEN_EXP: number;
  HASH_SECRET: string;
}

export { IEnvironment };
