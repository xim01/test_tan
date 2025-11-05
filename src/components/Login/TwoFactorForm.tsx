import React, { useState, useRef, useEffect, useCallback } from "react";
import LoginWrapper from "./LoginWrapper";
import LoginHeader from "./LoginHeader";
import { VALIDATION_ERRORS } from "../../constants/validationErrors";

const arrowSvg = (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.7973 5.58984H2.51238L8.66823 0.246094C8.76667 0.159961 8.70691 0 8.57683 0H7.02117C6.95261 0 6.88757 0.0246093 6.8366 0.0685546L0.193822 5.83242C0.132982 5.88516 0.0841885 5.95036 0.0507477 6.0236C0.0173069 6.09684 0 6.17642 0 6.25693C0 6.33745 0.0173069 6.41702 0.0507477 6.49027C0.0841885 6.56351 0.132982 6.62871 0.193822 6.68145L6.87527 12.4805C6.90163 12.5033 6.93327 12.5156 6.96667 12.5156H8.57507C8.70515 12.5156 8.76491 12.3539 8.66648 12.2695L2.51238 6.92578H12.7973C12.8747 6.92578 12.938 6.8625 12.938 6.78516V5.73047C12.938 5.65312 12.8747 5.58984 12.7973 5.58984Z"
      fill="black"
      fillOpacity="0.88"
    />
  </svg>
);

interface Props {
  onVerify: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
  isPending: boolean;
  error: Error | any;
}
export const TwoFactorForm: React.FC<Props> = ({ onVerify, onBack, onResend, isPending, error }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  const tick = useCallback(() => {
    if (!isRunning) return;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remaining = Math.max(60 - elapsed, 0);
    setTimeLeft(remaining);
    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setIsRunning(false);
    }
  }, [isRunning]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = paste.padEnd(6, "").slice(0, 6).split("");
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    onResend();

    setDigits(["", "", "", "", "", ""]);
    setTimeLeft(60);
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setHasError(false);
    inputRefs.current[0]?.focus();
  };

  const isCodeComplete = digits.every((d) => d !== "");
  const isTimerExpired = !isRunning;
  const showInvalidCode = hasError;
  const showContinueButton = isCodeComplete && isRunning && !showInvalidCode;
  const showGetNewCodeButton = isTimerExpired || showInvalidCode;

  return (
    <LoginWrapper customClass={"login-two-factor_PP"}>
      <div onClick={onBack} className="login_arrow" style={{ cursor: "pointer" }}>
        {arrowSvg}
      </div>

      <LoginHeader
        headerText="Two-Factor Authentication"
        text="Enter the 6-digit code from the Google Authenticator app"
        customClass="login-two-factor_PP"
      />

      <form className="login-two-factor" onSubmit={handleSubmit} onPaste={handlePaste}>
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
              className={`login-two-factor-input ${showInvalidCode ? "error" : ""}`}
              autoFocus={index === 0}
              disabled={isPending}
            />
          ))}
        </div>

        {showInvalidCode && <p className="login-two-factor-error-banner">{VALIDATION_ERRORS.invalidCode}</p>}

        {isRunning && !showContinueButton && !showInvalidCode && (
          <div className="login-two-factor-timer">Resend code in {timeLeft}s</div>
        )}

        {showContinueButton && (
          <button type="submit" disabled={isPending} className={`btn ${isPending ? "disabled" : ""}`}>
            {isPending ? "Verifying..." : "Continue"}
          </button>
        )}

        {showGetNewCodeButton && (
          <button type="button" onClick={handleResend} className="btn" disabled={isPending}>
            Get new code
          </button>
        )}
      </form>
    </LoginWrapper>
  );
};
