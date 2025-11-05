import React, { useState, useCallback, useMemo, useRef } from "react";
import LoginHeader from "./LoginHeader";
import LoginWrapper from "./LoginWrapper";
import { User, Lock } from "lucide-react";
import InputField from "./InputField";
import { VALIDATION_ERRORS } from "../../constants/validationErrors";

interface Props {
  onLogin: (email: string, password: string) => void;
  isPending: boolean;
  error: { message: string } | any;
}

export const LoginForm: React.FC<Props> = ({ onLogin, isPending, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({ email: false, password: false });

  const formRef = useRef<HTMLFormElement>(null);

  // === ВАЛИДАЦИЯ ===
  const validateEmail = useCallback((value: string): string => {
    if (!value.trim()) return VALIDATION_ERRORS.email.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return VALIDATION_ERRORS.email.invalid;
    return "";
  }, []);

  const validatePassword = useCallback((value: string): string => {
    if (!value) return VALIDATION_ERRORS.password.required;
    if (value.length < 6) return VALIDATION_ERRORS.password.minLength;
    return "";
  }, []);

  const emailError = useMemo(
    () => touchedFields.email && validateEmail(email),
    [email, touchedFields.email, validateEmail]
  );

  const passwordError = useMemo(
    () => touchedFields.password && validatePassword(password),
    [password, touchedFields.password, validatePassword]
  );

  const isFormValid = email.trim() && password.trim() && !emailError && !passwordError;
  const hasServerError = !!error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields({ email: true, password: true });
    if (!isFormValid) return;
    onLogin(email.trim(), password);
  };

  const handleBlur = (field: "email" | "password") => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <LoginWrapper customClass="login_PP">
      <LoginHeader headerText="Sign in to your account to continue" text="" customClass="login_PP" />

      {hasServerError && (
        <div className="form-error-banner" role="alert">
          {error?.message || VALIDATION_ERRORS.server}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="dir-vertical full-width login-content" noValidate>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          error={emailError}
          icon={<User size={16} />}
          autoComplete="email"
        />

        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur("password")}
          error={passwordError}
          icon={<Lock size={16} />}
          autoComplete="current-password"
          showToggle
          isPasswordVisible={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <button
          type="submit"
          disabled={!isFormValid || isPending}
          className={`btn ${!isFormValid || isPending ? "disabled" : ""}`}
          aria-label="Войти"
        >
          {isPending ? "Logining..." : "Log in"}
        </button>
      </form>
    </LoginWrapper>
  );
};
