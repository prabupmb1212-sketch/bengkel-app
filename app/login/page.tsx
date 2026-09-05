"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleCredentialsLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "register") {
      setSuccessMessage(
        "Form daftar siap digunakan. Hubungkan database untuk menyimpan akun baru.",
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = "/dashboard";
        return;
      }

      setErrorMessage("Username atau password salah. Silakan coba lagi.");
    } catch {
      setErrorMessage("Login gagal. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const providersResponse = await fetch("/api/auth/providers");
      const providers = (await providersResponse.json()) as Record<string, unknown>;

      if (!providers.google) {
        setErrorMessage(
          "Login Google belum dikonfigurasi. Isi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di .env.local.",
        );
        setIsLoading(false);
        return;
      }

      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setErrorMessage(
        "Login Google belum siap. Periksa Client ID, Client Secret, dan redirect URI.",
      );
      setIsLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <div className="login-glow login-glow-left" />
      <div className="login-glow login-glow-right" />

      <section className="login-layout">
        <div className="login-intro">
          <div className="brand-mark" aria-hidden="true">
            <span>BK</span>
          </div>
          <p className="eyebrow">Bengkelku workspace</p>
          <h1>Semua urusan bengkel, lebih rapi.</h1>
          <p className="intro-copy">
            Masuk untuk mengelola servis, pelanggan, dan operasional bengkel
            dari satu tempat.
          </p>
          <div className="intro-points">
            <span><i aria-hidden="true">01</i> Catat servis lebih cepat</span>
            <span><i aria-hidden="true">02</i> Pantau bengkel dengan rapi</span>
          </div>
          <div className="intro-rule" />
          <p className="intro-note">Dibuat untuk pekerjaan yang bergerak cepat.</p>
        </div>

        <div className="login-card">
          <div className="auth-tabs" role="tablist" aria-label="Jenis akses">
            <button
              className={`auth-tab ${mode === "login" ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                changeMode("login");
              }}
            >
              Masuk
            </button>
            <button
              className={`auth-tab ${mode === "register" ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => {
                changeMode("register");
              }}
            >
              Daftar
            </button>
          </div>

          <div className="card-heading">
            <p className="eyebrow">
              {mode === "login" ? "Selamat datang kembali" : "Mulai bersama Bengkelku"}
            </p>
            <h2>{mode === "login" ? "Masuk ke akunmu" : "Buat akun baru"}</h2>
            <p>
              {mode === "login"
                ? "Masuk dengan username dan password, atau gunakan Google."
                : "Buat akun baru dengan username dan password, atau gunakan Google."}
            </p>
          </div>

          <form
            className="credentials-form"
            onSubmit={handleCredentialsLogin}
            autoComplete={mode === "login" ? "on" : "off"}
          >
            <label htmlFor="email">Username / Email</label>
            <input
              id="email"
              type="text"
              placeholder="admin@bengkelku.local"
              autoComplete={mode === "login" ? "username" : "off"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              {mode === "login" && <button type="button">Lupa password?</button>}
            </div>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading
                ? "Memproses..."
                : mode === "login"
                  ? "Masuk ke dashboard"
                  : "Buat akun baru"}
            </button>
          </form>

          {successMessage && <p className="auth-success">{successMessage}</p>}

          <div className="login-divider"><span>atau lanjutkan dengan</span></div>

          <button className="google-button" type="button" onClick={handleGoogleLogin} disabled={isLoading}>
            <span className="google-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" />
                <path fill="#34A853" d="M12 21.69c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.69Z" />
                <path fill="#FBBC05" d="M6.54 13.78a5.85 5.85 0 0 1 0-3.56V7.69H3.3a9.77 9.77 0 0 0 0 8.62l3.24-2.53Z" />
                <path fill="#EA4335" d="M12 6.19c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.27 14.63 2.31 12 2.31a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 7.91 9.46 6.19 12 6.19Z" />
              </svg>
            </span>
            {mode === "login" ? "Masuk dengan Google" : "Daftar dengan Google"}
          </button>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <div className="login-divider">
            <span>akses aman</span>
          </div>

          <p className="terms-copy">
            Dengan melanjutkan, kamu menyetujui kebijakan penggunaan dan
            privasi Bengkelku.
          </p>
        </div>
      </section>
    </main>
  );
}