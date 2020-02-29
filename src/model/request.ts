interface ILogin {
  account: string;
  password: string;
}

interface ILoginUser {
  id: string;
  role: string;
  name: string;
}

interface IContext {
  url: string;
  loginUser?: ILoginUser;
}

export { ILogin, IContext };
