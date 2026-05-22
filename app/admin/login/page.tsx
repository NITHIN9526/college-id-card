"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@college.edu");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(json.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Background Glow */}
      <div className="bg-gradient-radial" style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />

      {/* Login Card */}
      <div
        className="glass-card-static animate-fade-in-up"
        style={{
          padding: 48,
          maxWidth: 400,
          width: "100%",
          margin: 24,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "white",
            }}
          >
            ID
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Admin Login</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32, textAlign: "center", fontSize: 14 }}>
          College ID Portal Management
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              color: "#f87171",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@college.edu"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--glass-border)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "var(--text-primary)",
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--glass-border)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "var(--text-primary)",
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            {isLoading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
          Demo Credentials:
          <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 12 }}>
            📧 admin@college.edu
            <br />
            🔑 admin123
          </div>
        </div>

        <Link href="/" style={{ display: "block", marginTop: 24, textAlign: "center", color: "var(--accent-light)", fontSize: 13, textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
