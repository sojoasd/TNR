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

// interface IGoogleAlbums {

// }

export { IGoogleAuthTokens, IGoogleProfile };
