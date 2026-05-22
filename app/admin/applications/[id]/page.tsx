"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface StudentDetail {
  id: string;
  fullName: string;
  admissionNo: string;
  department: string;
  semester: string;
  bloodGroup?: string;
  address: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  photoUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Pending Review", color: "#f59e0b", icon: "⏳" },
  approved: { label: "Approved", color: "#10b981", icon: "✅" },
  rejected: { label: "Rejected", color: "#ef4444", icon: "❌" },
  printed: { label: "ID Printed", color: "#6366f1", icon: "🎴" },
};

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<StudentDetail>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/admin/applications/${id}`);
        const json = await res.json();

        if (res.ok) {
          setStudent(json);
          setEditData(json);
          setNewStatus(json.status);
        } else {
          setError(json.error || "Failed to load application");
        }
      } catch {
        setError("Network error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setIsChangingStatus(true);
    try {
      const res = await fetch(`/api/admin/applications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStudent(updated);
        setNewStatus(status);
      } else {
        setError("Failed to update status");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleUpdateData = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updated = await res.json();
        setStudent(updated);
        setEditData(updated);
        setIsEditing(false);
      } else {
        setError("Failed to update data");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ textAlign: "center" }}>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 20, color: "#f87171" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const config = statusConfig[student.status] || { label: student.status, color: "#666", icon: "?" };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <Link href="/admin/applications" style={{ color: "var(--accent-light)", textDecoration: "none", fontSize: 13, marginBottom: 12, display: "block" }}>
            ← Back to Applications
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{student.fullName}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, backgroundColor: `${config.color}15` }}>
              {config.icon} {config.label}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Submitted {new Date(student.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 20, color: "#f87171", marginBottom: 24 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Left: Student Info */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Student Information</h2>

          {student.photoUrl && (
            <div style={{ marginBottom: 20, textAlign: "center" }}>
              <img
                src={student.photoUrl}
                alt="Student Photo"
                style={{
                  width: "100%",
                  maxWidth: 200,
                  height: 250,
                  borderRadius: 8,
                  objectFit: "cover",
                  border: "1px solid var(--glass-border)",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!isEditing && (
              <>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Admission Number</p>
                  <p style={{ fontSize: 14, fontFamily: "monospace" }}>{student.admissionNo}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Email</p>
                  <p style={{ fontSize: 14 }}>{student.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Department</p>
                  <p style={{ fontSize: 14 }}>{student.department}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Semester</p>
                  <p style={{ fontSize: 14 }}>{student.semester}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Blood Group</p>
                  <p style={{ fontSize: 14 }}>{student.bloodGroup || "Not provided"}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Student Phone</p>
                  <p style={{ fontSize: 14 }}>{student.studentPhone}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Parent Phone</p>
                  <p style={{ fontSize: 14 }}>{student.parentPhone}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Address</p>
                  <p style={{ fontSize: 14 }}>{student.address}</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    marginTop: 16,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--glass-border)",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "var(--accent-light)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit Information
                </button>
              </>
            )}

            {isEditing && (
              <>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.fullName || ""}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                    Student Phone
                  </label>
                  <input
                    type="tel"
                    value={editData.studentPhone || ""}
                    onChange={(e) => setEditData({ ...editData, studentPhone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    value={editData.parentPhone || ""}
                    onChange={(e) => setEditData({ ...editData, parentPhone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                    Address
                  </label>
                  <textarea
                    value={editData.address || ""}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      fontFamily: "inherit",
                      minHeight: 80,
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleUpdateData}
                    disabled={isUpdating}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      color: "#10b981",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {isUpdating ? "Saving..." : "💾 Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(student);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "transparent",
                      color: "var(--text-secondary)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status Management */}
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Status Management</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["pending", "approved", "rejected", "printed"].map((status) => {
                const config = statusConfig[status];
                const isSelected = newStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    disabled={isChangingStatus || newStatus === status}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: isSelected ? `2px solid ${config.color}` : "1px solid var(--glass-border)",
                      backgroundColor: isSelected ? `${config.color}15` : "rgba(255, 255, 255, 0.02)",
                      color: isSelected ? config.color : "var(--text-primary)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    {config.icon} {config.label}
                    {isSelected && " ✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ID Card Generation */}
          {student.status === "approved" && (
            <div className="glass-card-static" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>ID Card Generation</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                Generate and print the student's ID card
              </p>

              <Link
                href={`/admin/id-card/${student.id}`}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                🎴 Generate ID Card
              </Link>
            </div>
          )}

          {/* Info Box */}
          <div className="glass-card-static" style={{ padding: 24, backgroundColor: "rgba(99, 102, 241, 0.05)", borderLeft: "3px solid var(--accent-light)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>ℹ️ Application Info</h3>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6 }}>
              <div>
                <strong>ID:</strong> {student.id}
              </div>
              <div>
                <strong>Submitted:</strong> {new Date(student.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Last Updated:</strong> {new Date(student.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
