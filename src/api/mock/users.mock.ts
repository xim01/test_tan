export const mockUsers: Record<
  string,
  { password: string; name: string; requires2FA: boolean; isLocked: boolean; isEmailVerified: boolean }
> = {
  "user@example.com": {
    password: "123456",
    name: "Алексей",
    requires2FA: true,
    isLocked: false,
    isEmailVerified: true,
  },
  "no2fa@example.com": {
    password: "123456",
    name: "Мария",
    requires2FA: false,
    isLocked: false,
    isEmailVerified: true,
  },
  "valid@ok.com": {
    password: "123456",
    name: "Alice",
    requires2FA: false,
    isLocked: false,
    isEmailVerified: true,
  },
  "2fa@required.com": {
    password: "123456",
    name: "Bob",
    requires2FA: true,
    isLocked: false,
    isEmailVerified: true,
  },
  "locked@account.com": {
    password: "123456",
    name: "Charlie",
    requires2FA: false,
    isLocked: true,
    isEmailVerified: true,
  },
  "unverified@email.com": {
    password: "123456",
    name: "Dana",
    requires2FA: false,
    isLocked: false,
    isEmailVerified: false,
  },
};

export const mock2FACodes: Record<string, string> = {
  "user@example.com": "123456",
};
