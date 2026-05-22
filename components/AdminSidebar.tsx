"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      style={{
        width: 280,
        borderRight: "1px solid var(--glass-border)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(10, 14, 26, 0.4)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: 24, borderBottom: "1px solid var(--glass-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "white",
            }}
          >
            ID
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Admin Panel</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>College ID Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 16, overflow: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link
            href="/admin"
            className="nav-link"
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
              e.currentTarget.style.color = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/applications"
            className="nav-link"
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
              e.currentTarget.style.color = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            📋 Applications
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: 16, borderTop: "1px solid var(--glass-border)" }}>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid rgba(239, 68, 68, 0.2)",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            color: "var(--text-secondary)",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          {isLoggingOut ? "Logging out..." : "🚪 Logout"}
        </button>
      </div>
    </aside>
  );
}
