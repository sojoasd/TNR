import { IEnvironment } from "../model/common";

function envConfig(env, keys) {
  return keys.reduce((a, k) => {
    let v = env[k];
    if (v != undefined) a[k] = JSON.parse(new Buffer(v, "base64").toString("utf-8"));
    return a;
  }, {});
}

const KEYS = ["PORT", "PINO_CONFIG", "MONGO_CONFIG", "TOKEN_SIGNATURE", "TOKEN_EXP", "HASH_SECRET", "GOOGLE_API_CONFIG", "GOOGLE_API_SCOPE"];

const envJson = envConfig(process.env, KEYS);

const env: IEnvironment = {
  PORT: envJson.PORT,
  PINO_CONFIG: envJson.PINO_CONFIG,
  MONGO_CONFIG: envJson.MONGO_CONFIG,
  TOKEN_SIGNATURE: envJson.TOKEN_SIGNATURE,
  TOKEN_EXP: envJson.TOKEN_EXP,
  HASH_SECRET: envJson.HASH_SECRET,
  GOOGLE_API_CONFIG: envJson.GOOGLE_API_CONFIG,
  GOOGLE_API_SCOPE: envJson.GOOGLE_API_SCOPE
};

console.log(JSON.stringify(env));

export default env;
