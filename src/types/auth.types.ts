export interface User {
  name: string;
  email: string;
}

export interface LoginResponse {
  requires2FA: true;
  token: string;
}

export interface LoginSuccessResponse {
  accessToken: string;
  user: User;
}

export type AuthResponse = LoginResponse | LoginSuccessResponse;

export interface Verify2FAResponse {
  accessToken: string;
  user: User;
}
