export const VALIDATION_ERRORS = {
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email",
  },
  password: {
    required: "Password is required",
    minLength: "Minimum 6 characters",
  },
  server: "Login failed. Please check your credentials and try again.",
  invalidCode: "Invalid code",
} as const;

export type ValidationKey = keyof typeof VALIDATION_ERRORS;
