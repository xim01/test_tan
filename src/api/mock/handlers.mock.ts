import { delay } from "../../utils/delay";
import { mockUsers, mock2FACodes } from "./users.mock";
import type { AuthResponse, Verify2FAResponse } from "../../types/auth.types";
import { VALIDATION_ERRORS } from "../../constants/validationErrors";

export const mockLogin = async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
  await delay(800);

  const user = mockUsers[email];
  if (!user || user.password !== password) {
    throw new Error(VALIDATION_ERRORS.server);
  }

  const tempToken = btoa(`${email}:${Date.now()}`);

  if (user.requires2FA) {
    return { requires2FA: true, token: tempToken };
  }

  const accessToken = btoa(`final:${email}`);
  return { accessToken, user: { name: user.name, email } };
};

export const mockVerify2FA = async ({ token, code }: { token: string; code: string }): Promise<Verify2FAResponse> => {
  await delay(600);

  try {
    const decoded = atob(token);
    const email = decoded.split(":")[0];

    const user = mockUsers[email];
    if (!user || !user.requires2FA) {
      throw new Error("2FA не требуется");
    }

    const expected = mock2FACodes[email];
    if (!expected || code !== expected) {
      throw new Error("Неверный код 2FA");
    }

    return {
      accessToken: btoa(`final:${email}`),
      user: { name: user.name, email },
    };
  } catch {
    throw new Error("Invalid token");
  }
};
