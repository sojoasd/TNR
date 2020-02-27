interface IRegister {
  account: string;
  password: string;
  name: string;
}

interface ILogin {
  account: string;
  password: string;
}

export { IRegister, ILogin };
