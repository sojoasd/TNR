interface ILogin {
  account: string;
  password: string;
}

interface ILoginUser {
  id: string;
  role: string;
  name: string;
  epochDate: number; //create token timestamp
  googleTokenExpSeconds: number;
}

interface IContext {
  url?: string;
  loginUser?: ILoginUser;
}

interface IClientLogin {
  code: string;
}

export { ILogin, IContext, ILoginUser, IClientLogin };
