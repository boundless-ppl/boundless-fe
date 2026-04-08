export type UserData = {
  userId: string;
  nama_lengkap: string;
  email: string;
  role: string;
  isPremium?: boolean;
  premiumStartAt?: string | null;
  premiumEndAt?: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  nama_lengkap: string;
  email: string;
  password: string;
  role: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedPrivacyPolicy: boolean;
};
