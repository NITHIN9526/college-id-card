"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Student {
  id: string;
  fullName: string;
  admissionNo: string;
  department: string;
  status: string;
  createdAt: string;
}

interface ApplicationsResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Pending", color: "#f59e0b", icon: "⏳" },
  approved: { label: "Approved", color: "#10b981", icon: "✅" },
  rejected: { label: "Rejected", color: "#ef4444", icon: "❌" },
  printed: { label: "Printed", color: "#6366f1", icon: "🎴" },
};

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<ApplicationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        search: searchQuery,
        page: currentPage.toString(),
        limit: "20",
      });

      const res = await fetch(`/api/admin/applications?${params}`);
      const json = await res.json();

      if (res.ok) {
        setApplications(json);
      } else {
        setError(json.error || "Failed to load applications");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Applications</h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage and review student ID card applications</p>
      </div>

      {/* Filters */}
      <div className="glass-card-static" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, admission no, or email..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--glass-border)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "var(--text-primary)",
                fontSize: 13,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--glass-border)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "var(--text-primary)",
                fontSize: 13,
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="printed">Printed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 20, color: "#f87171", marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Applications Table */}
      <div className="glass-card-static" style={{ padding: 24 }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p>Loading applications...</p>
          </div>
        ) : applications && applications.students.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            <p>No applications found</p>
          </div>
        ) : applications ? (
          <>
            <div style={{ overflowX: "auto", marginBottom: 20 }}>
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
                      Submitted
                    </th>
                    <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.students.map((app) => {
                    const config = statusConfig[app.status] || { label: app.status, color: "#666", icon: "?" };
                    const submittedDate = new Date(app.createdAt).toLocaleDateString();
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
                        <td style={{ padding: 12, fontSize: 13, color: "var(--text-secondary)" }}>{submittedDate}</td>
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

            {/* Pagination */}
            {applications.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    ← Previous
                  </button>
                )}

                {Array.from({ length: applications.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: page === currentPage ? "1px solid var(--accent-light)" : "1px solid var(--glass-border)",
                      backgroundColor: page === currentPage ? "rgba(99, 102, 241, 0.1)" : "rgba(255, 255, 255, 0.02)",
                      color: page === currentPage ? "var(--accent-light)" : "var(--text-primary)",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: page === currentPage ? 600 : 400,
                    }}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < applications.totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
