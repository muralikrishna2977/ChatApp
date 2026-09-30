import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { authApi, getErrorMessage } from "../../api/index.js";
import { loadUser, saveUser } from "../../lib/session.js";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";
import AuthLayout from "./AuthLayout.jsx";
import PasswordField from "./PasswordField.jsx";

const DEMO_ACCOUNTS = [
  { email: "ram166@gmail.com", password: "123" },
  { email: "hari166@gmail.com", password: "123" },
];

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const notice = location.state?.notice;

  if (loadUser()) return <Navigate to="/chat" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await authApi.signIn(email.trim(), password);
      if (data.message !== "Login successful") {
        setError(data.message || "Sign in failed.");
        return;
      }
      const user = { user_id: data.userid, name: data.name, email: data.email };
      saveUser(user);
      navigate("/chat", { replace: true, state: { user } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoAccount(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your conversations."
      footer={
        <>
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </>
      }
    >
      {notice && !error && (
        <div className="alert alert--success">
          <Icon name="checkCircle" size={16} />
          {notice}
        </div>
      )}

      <form className="auth__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
        </label>

        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {submitting && <Spinner size="sm" label="Signing in" />}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="demo-accounts">
        <p className="demo-accounts__title">Demo accounts</p>
        <p className="demo-accounts__hint">Try the app instantly with one of these test users.</p>
        <ul className="demo-accounts__list">
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.email} className="demo-accounts__item">
              <span className="demo-accounts__email">{account.email}</span>
              <span className="demo-accounts__password">Password: {account.password}</span>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => fillDemoAccount(account)}
                disabled={submitting}
              >
                Use
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
}
