import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string | any;
  icon: React.ReactNode;
  autoComplete?: string;
  showToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
  autoComplete,
  showToggle,
  isPasswordVisible,
  onTogglePassword,
}) => {
  return (
    <div className="login-input-group">
      <div className="text_input-wrapper">
        <span className="text_input-svg">{icon}</span>
        <input
          className={`text_input ${type === "password" ? "password" : ""} ${error ? "error" : ""}`}
          type={showToggle && isPasswordVisible ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          aria-label={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${type}-error` : undefined}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="text_input-toggle"
            aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
          >
            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${type}-error`} className="input-error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(InputField);
