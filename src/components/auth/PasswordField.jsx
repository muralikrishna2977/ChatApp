import { useState } from "react";
import Icon from "../ui/Icon.jsx";

export default function PasswordField({ label, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <span className="password-input">
        <input className="input" type={visible ? "text" : "password"} {...inputProps} />
        <button
          type="button"
          className="password-input__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={18} />
        </button>
      </span>
    </label>
  );
}
