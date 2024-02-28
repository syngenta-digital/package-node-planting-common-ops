export type IPlantingSecretStore = {
  [key: string]:
    | IAuthenticationSecret
    | ICropwiseSecret
    | ISignupSecret
    | IDatabusSecret
    | IUniteStateProxyLookup2021Secret
    | IAWSPDFConfigSecret
    | IRemoteConfigSecret;
};

export type IAuthenticationSecret = {
  baseUrl: string;
  publicKey: string;
  cacheDuration: number;
};

export type ICropwiseSecret = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
};

export type ISignupSecret = {
  audience: string;
  subject: string;
  issuer: string;
  templateId: string;
  redirect: string;
  privateKey: string;
  publicKey: string;
};

export type IDatabusSecret = {
  baseUrl: string;
  isoXmlApiKey: string;
  isoXmlConversionTimeoutMs: number;
  statusCallDelayMs: number;
};

export type ISSOSecret = {
  sistemank: {
    secret: string;
    redirect: string;
    postRedirect: string;
    prefix: string;
    seed: string;
    baseApiUrl: string;
    seedSelectorApiUrl: string;
    serviceAccount: string;
    servicePassword: string;
    passwordSecret: string;
    branding: {
      pageTitle: string;
      favIcon: string;
      styleOverrides: string;
      defaultLanguage: string;
      logo: string;
      headerImage: string;
      logoutRedirect: string;
    };
  };
};

export type IUniteStateProxyLookup2021Secret = {
  baseUrl: string;
  authUrl: string;
  clientId: string;
  clientSecret: string;
  clientScope: string;
  cacheDurationMinutes: string;
};

export type IAWSPDFConfigSecret = {
  AWS_ACCESS_KEY_ID: string;
  AWS_DEFAULT_REGION: string;
  AWS_SECRET_ACCESS_KEY: string;
};

export type IRemoteConfigSecret = {
  baseUrl: string;
  environment: string;
  password?: string;
};
