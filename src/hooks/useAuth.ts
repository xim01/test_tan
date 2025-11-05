import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, verify2FA } from "../api/auth.api";
import type { User } from "../types/auth.types";

export type UseAuthReturn = {
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
};

export const useAuth = (): UseAuthReturn => {
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [twoFAError, setTwoFAError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setLoginError(null);
      if ("requires2FA" in data) {
        setTempToken(data.token);
      } else {
        localStorage.setItem("token", data.accessToken);
        setUser(data.user);
      }
    },
    onError: (error: any) => {
      setLoginError(error?.message || "Login failed");
    },
  });

  // === 2FA ===
  const verify2FAMutation = useMutation({
    mutationFn: verify2FA,
    onSuccess: (data) => {
      setTwoFAError(null);
      localStorage.setItem("token", data.accessToken);
      setUser(data.user);
      setTempToken(null);
    },
    onError: (error: any) => {
      setTwoFAError(error?.message || "Invalid code");
    },
  });

  const onResend = useCallback(() => {
    if (!tempToken) return;
    console.warn("onResend: not implemented — need to store email");
  }, [tempToken]);

  const resetLogin = () => {
    setTempToken(null);
    setLoginError(null);
    loginMutation.reset();
    verify2FAMutation.reset();
  };

  const reset2FA = () => {
    setTwoFAError(null);
    verify2FAMutation.reset();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTempToken(null);
    setLoginError(null);
    setTwoFAError(null);
    loginMutation.reset();
    verify2FAMutation.reset();
  };

  useEffect(() => {
    if (tempToken) {
      setTwoFAError(null);
    }
  }, [tempToken]);

  const isLoading = loginMutation.isPending || verify2FAMutation.isPending;

  return {
    tempToken,
    user,
    login: loginMutation.mutate,
    verify2FA: (code: string) => tempToken && verify2FAMutation.mutate({ token: tempToken, code }),
    isLoginPending: loginMutation.isPending,
    is2FAPending: verify2FAMutation.isPending,
    loginError,
    twoFAError,
    resetLogin,
    reset2FA,
    logout,
    onResend,
    isLoading,
  };
};
