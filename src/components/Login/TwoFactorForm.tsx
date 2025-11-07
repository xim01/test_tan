import React, { useState, useRef, useEffect, useCallback } from "react";
import LoginWrapper from "./LoginWrapper";
import LoginHeader from "./LoginHeader";
import { ArrowLeft } from "lucide-react";
import type { TwoFactorFormProps } from "../../types/auth.types";

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ onVerify, onBack, onResend, isPending, error }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResend = useCallback(() => {
    onResend();
    setDigits(["", "", "", "", "", ""]);
    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  }, [onResend]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = paste.padEnd(6, "").slice(0, 6).split("");
    setDigits(newDigits);
    const focusIndex = newDigits.findIndex((d) => !d);
    inputRefs.current[focusIndex === -1 ? 5 : focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const isCodeComplete = digits.every((d) => d !== "");
  const isTimerExpired = timeLeft === 0;
  const hasError = !!error;
  const showContinue = isCodeComplete && timeLeft > 0 && !hasError;
  const showResend = isTimerExpired || hasError;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <LoginWrapper customClass="login-two-factor_PP">
      <button type="button" onClick={onBack} className="login_arrow" aria-label="Back">
        <ArrowLeft size={16} />
      </button>

      <LoginHeader
        headerText="Two-Factor Authentication"
        text="Enter the 6-digit code from the Google Authenticator app"
        customClass="login-two-factor_PP"
      />

      <form className="login-two-factor" onSubmit={handleSubmit} onPaste={handlePaste} noValidate>
        <div className="login-two-factor-container login-content">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`login-two-factor-input ${hasError ? "error" : ""}`}
              disabled={isPending}
              aria-label={`Digit ${index + 1}`}
              aria-invalid={hasError}
            />
          ))}
        </div>

        {hasError && (
          <p className="login-two-factor-error-banner" role="alert">
            {error}
          </p>
        )}

        {timeLeft > 0 && !showContinue && !hasError && (
          <div className="login-two-factor-timer" aria-live="polite">
            Resend code in {timeLeft}s
          </div>
        )}

        {showContinue && (
          <button type="submit" disabled={isPending} className={`btn ${isPending ? "disabled" : ""}`}>
            {isPending ? "Verifying..." : "Continue"}
          </button>
        )}

        {showResend && (
          <button type="button" onClick={handleResend} className="btn" disabled={isPending}>
            Get new code
          </button>
        )}
      </form>
    </LoginWrapper>
  );
};
