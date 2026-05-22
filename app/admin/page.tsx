"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  printed: number;
  recentApplications: Array<{
    id: string;
    fullName: string;
    admissionNo: string;
    department: string;
    status: string;
    createdAt: string;
  }>;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Pending", color: "#f59e0b", icon: "⏳" },
  approved: { label: "Approved", color: "#10b981", icon: "✅" },
  rejected: { label: "Rejected", color: "#ef4444", icon: "❌" },
  printed: { label: "Printed", color: "#6366f1", icon: "🎴" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (res.ok) {
          setStats(json);
        } else {
          setError(json.error || "Failed to load stats");
        }
      } catch {
        setError("Network error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 20, color: "#f87171" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    { label: "Total Applications", value: stats.total, icon: "📊", color: "#6366f1" },
    { label: "Pending Review", value: stats.pending, icon: "⏳", color: "#f59e0b" },
    { label: "Approved", value: stats.approved, icon: "✅", color: "#10b981" },
    { label: "Rejected", value: stats.rejected, icon: "❌", color: "#ef4444" },
    { label: "ID Printed", value: stats.printed, icon: "🎴", color: "#8b5cf6" },
  ];

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Welcome to the admin panel. Overview of all applications.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass-card-static"
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{card.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: card.color }}>{card.value}</p>
              </div>
              <div style={{ fontSize: 24 }}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="glass-card-static" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Recent Applications</h2>
          <Link href="/admin/applications" style={{ color: "var(--accent-light)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            View All →
          </Link>
        </div>

        {stats.recentApplications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            <p style={{ fontSize: 14 }}>No applications yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Name
                  </th>
                  <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Admission
                  </th>
                  <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Department
                  </th>
                  <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Status
                  </th>
                  <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentApplications.map((app) => {
                  const config = statusConfig[app.status] || { label: app.status, color: "#666", icon: "?" };
                  return (
                    <tr key={app.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                      <td style={{ padding: 12, fontSize: 13 }}>{app.fullName}</td>
                      <td style={{ padding: 12, fontSize: 13, fontFamily: "monospace" }}>{app.admissionNo}</td>
                      <td style={{ padding: 12, fontSize: 13, color: "var(--text-secondary)" }}>{app.department}</td>
                      <td style={{ padding: 12, fontSize: 13 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 4, backgroundColor: `${config.color}15` }}>
                          {config.icon} {config.label}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>
                        <Link href={`/admin/applications/${app.id}`} style={{ color: "var(--accent-light)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                          Review →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
