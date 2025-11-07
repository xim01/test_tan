import { delay } from "../../lib/delay";
import { mockUsers, mock2FACodes } from "./users.mock";

export const mockLogin = async ({ email, password }: { email: string; password: string }) => {
  await delay(800);

  const user = mockUsers[email];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.password !== password) {
    throw new Error("Invalid email or password");
  }

  if (user.isLocked) {
    throw new Error("Account is locked. Contact support.");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first.");
  }

  if (user.requires2FA) {
    const tempToken = btoa(`${email}:${Date.now()}`);
    return { requires2FA: true, token: tempToken };
  }

  const accessToken = btoa(`final:${email}`);
  return { accessToken, user: { name: user.name, email } };
};

export const mockVerify2FA = async ({ token, code }: { token: string; code: string }) => {
  await delay(600);

  try {
    const decoded = atob(token);
    const email = decoded.split(":")[0];
    const user = mockUsers[email];

    if (!user || !user.requires2FA) {
      throw new Error("2FA not enabled for this account");
    }

    const expected = mock2FACodes[email];
    if (!expected) {
      throw new Error("2FA code expired. Please request a new one.");
    }

    if (code !== expected) {
      throw new Error("Invalid 2FA code");
    }

    return {
      accessToken: btoa(`final:${email}`),
      user: { name: user.name, email },
    };
  } catch {
    throw new Error("Invalid or expired token");
  }
};
