export interface User {
  name: string;
  email: string;
}

export interface LoginSuccessResponse {
  accessToken: string;
  user: User;
}

export interface Login2FAResponse {
  requires2FA: true;
  token: string;
}

export type AuthResponse = LoginSuccessResponse | Login2FAResponse;

export interface Verify2FAResponse {
  accessToken: string;
  user: User;
}

export interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isPending: boolean;
  error: string | null;
}

export interface TwoFactorFormProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
  isPending: boolean;
  error: string | null;
}

export interface UseAuthReturn {
  tempToken: string | null;
  user: User | null;
  login: (credentials: { email: string; password: string }) => void;
  verify2FA: (code: string) => void;
  isLoginPending: boolean;
  is2FAPending: boolean;
  loginError: string | null;
  twoFAError: string | null;
  resetLogin: () => void;
  reset2FA: () => void;
  logout: () => void;
  onResend: () => void;
  isLoading: boolean;
}
