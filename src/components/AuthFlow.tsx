import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "./Login/LoginForm";
import { TwoFactorForm } from "./Login/TwoFactorForm";
import { AuthSuccess } from "./Login/AuthSuccess";

export function AuthFlow() {
  const {
    user,
    tempToken,
    login,
    verify2FA,
    logout,
    isLoginPending,
    is2FAPending,
    loginError,
    twoFAError,
    resetLogin,
    onResend,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <>
        <div className="PP-overlay" />
        <div className="screen-center">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  if (user) {
    return <AuthSuccess user={user} onLogout={logout} />;
  }

  const formContent = tempToken ? (
    <TwoFactorForm
      onVerify={verify2FA}
      onBack={resetLogin}
      isPending={is2FAPending}
      onResend={onResend}
      error={twoFAError}
    />
  ) : (
    <LoginForm
      onLogin={(email, password) => login({ email, password })}
      isPending={isLoginPending}
      error={loginError}
    />
  );

  return (
    <>
      <div className="PP-overlay" />
      <div className="screen-center">{formContent}</div>
    </>
  );
}
