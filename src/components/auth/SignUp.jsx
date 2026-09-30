import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi, getErrorMessage } from "../../api/index.js";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";
import AuthLayout from "./AuthLayout.jsx";
import PasswordField from "./PasswordField.jsx";

const INITIAL_FORM = { name: "", email: "", password: "", confirmPassword: "" };

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const email = form.email.trim();
      await authApi.signUp(form.name.trim(), email, form.password);
      navigate("/", {
        replace: true,
        state: { email, notice: "Account created. Sign in to get started." },
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It only takes a minute to get started."
      footer={
        <>
          Already have an account? <Link to="/">Sign in</Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Full name</span>
          <input
            className="input"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={updateField("name")}
            required
            disabled={submitting}
          />
        </label>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField("email")}
            required
            disabled={submitting}
          />
        </label>

        <PasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={updateField("password")}
          required
          disabled={submitting}
        />

        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          required
          disabled={submitting}
        />

        {error && (
          <div className="alert alert--error" role="alert">
            <Icon name="alertCircle" size={16} />
            {error}
          </div>
        )}

        <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
          {submitting && <Spinner size="sm" label="Creating account" />}
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
