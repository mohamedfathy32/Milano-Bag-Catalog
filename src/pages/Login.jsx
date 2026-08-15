import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useI18n from "../hooks/useI18n";
import { loginWithEmail } from "../services/authService";

export default function Login() {
  const { isAdmin, loading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await loginWithEmail(form.email, form.password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (authError) {
      const invalidCredentials = [
        "auth/invalid-credential",
        "auth/invalid-email",
        "auth/user-not-found",
        "auth/wrong-password",
      ].includes(authError.code);
      setError(
        t(invalidCredentials ? "auth.invalidCredentials" : "auth.genericError"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="eyebrow">{t("auth.loginEyebrow")}</span>
        <h1>{t("auth.login")}</h1>
        <p>{t("auth.loginDescription")}</p>

        <form onSubmit={handleSubmit}>
          <label>
            <span>{t("auth.email")}</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder={t("auth.emailPlaceholder")}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>{t("auth.password")}</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder={t("auth.passwordPlaceholder")}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? t("auth.signingIn") : t("auth.login")}
          </button>
        </form>
      </section>
    </main>
  );
}
