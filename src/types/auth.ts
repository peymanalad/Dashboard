export interface AuthFormProps {
  username: string;
  password: string;
}

export interface AuthResponseProps {
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  shouldResetPassword: boolean;
  passwordResetCode: null;
  userId: number;
  requiresTwoFactorVerification: boolean;
  twoFactorAuthProviders: null;
  twoFactorRememberClientToken: null;
  returnUrl: null;
  refreshToken: string;
  refreshTokenExpireInSeconds: number;
}
