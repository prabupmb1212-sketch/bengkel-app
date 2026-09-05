"use client";

import { signOut } from "next-auth/react";

export default function DashboardPage() {
  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.replace("/login");
  }

  return (
    <main className="welcome-shell">
      <section className="welcome-card">
        <div className="welcome-mark" aria-hidden="true">BK</div>
        <p className="welcome-label">Bengkelku workspace</p>
        <h1>Halo, selamat datang di Bengkelku.</h1>
        <p>
          Senang melihatmu kembali. Semua kebutuhan operasional bengkelmu siap
          dikelola dari sini.
        </p>
        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Keluar dari Bengkelku
        </button>
      </section>
    </main>
  );
}