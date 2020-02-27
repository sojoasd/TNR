import fs from "fs";
import { IEnvironment } from "./../model/common";

class Env {
  private static _instance: Env;

  private constructor() {}

  static getInstance() {
    if (!Env._instance) {
      Env._instance = new Env();
    }

    return Env._instance;
  }

  getEnvJson() {
    const str: any = fs.readFileSync("env.json");
    const envJson: IEnvironment = JSON.parse(str);

    return envJson;
  }
}

const envUt = Env.getInstance();

export default envUt.getEnvJson();
