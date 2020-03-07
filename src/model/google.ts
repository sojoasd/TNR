import { ORDER_BY } from "../enum/common";

interface IGoogleAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface IGoogleProfile {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface IDriverFileQuery {
  folderId: string;
}

interface IDriverFileIds {
  folderId: string;
  fileIds: string[];
}

interface IDriverFolderQuery {
  keyword?: string;
  folderId?: string;
  orderby?: ORDER_BY;
}

export { IGoogleAuthTokens, IGoogleProfile, IDriverFileQuery, IDriverFileIds, IDriverFolderQuery };
