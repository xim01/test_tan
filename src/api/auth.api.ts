import { mockLogin, mockVerify2FA } from "./mock/handlers.mock";
import type { AuthResponse, Verify2FAResponse } from "../types/auth.types";

export const login = (credentials: { email: string; password: string }) =>
  mockLogin(credentials) as Promise<AuthResponse>;

export const verify2FA = (data: { token: string; code: string }) => mockVerify2FA(data) as Promise<Verify2FAResponse>;
