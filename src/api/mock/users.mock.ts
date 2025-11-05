export const mockUsers: Record<string, { password: string; name: string; requires2FA: boolean }> = {
  "user@example.com": {
    password: "password123",
    name: "Алексей",
    requires2FA: true,
  },
  "no2fa@example.com": {
    password: "123456",
    name: "Мария",
    requires2FA: false,
  },
};

export const mock2FACodes: Record<string, string> = {
  "user@example.com": "123456",
};
