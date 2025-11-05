import React from "react";

interface LoginWrapperProps {
  customClass?: string;
  children: React.ReactNode;
}

const LoginWrapper: React.FC<LoginWrapperProps> = ({ customClass = "", children }) => {
  return <div className={`login login-size--base dir-vertical ${customClass}`}>{children}</div>;
};

export default LoginWrapper;
