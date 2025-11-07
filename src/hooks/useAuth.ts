import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, verify2FA } from "../api/auth.api";
import type { User, AuthResponse, Verify2FAResponse, UseAuthReturn } from "../types/auth.types";

export const useAuth = (): UseAuthReturn => {
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [twoFAError, setTwoFAError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: AuthResponse) => {
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

  const verify2FAMutation = useMutation({
    mutationFn: verify2FA,
    onSuccess: (data: Verify2FAResponse) => {
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
