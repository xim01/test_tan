import React from "react";
import type { User } from "../../types/auth.types";

interface Props {
  user: User;
  onLogout: () => void;
}

export const AuthSuccess: React.FC<Props> = ({ user, onLogout }) => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Успешно!</h2>
      <p>
        Добро пожаловать, <strong>{user.name}</strong>!
      </p>
      <p>
        <small>{user.email}</small>
      </p>
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
};
