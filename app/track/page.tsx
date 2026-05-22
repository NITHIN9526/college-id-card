"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface TrackResult {
  id: string;
  fullName: string;
  admissionNo: string;
  department: string;
  status: string;
  createdAt: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState(searchParams.get("id") || "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setApplicationId(id);
      handleTrack(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTrack = async (id?: string) => {
    const trackId = id || applicationId.trim();
    if (!trackId) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/track/${trackId}`);
      const json = await res.json();

      if (res.ok) {
        setResult(json);
      } else {
        setError(json.error || "Application not found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { label: string; class: string; icon: string; step: number }> = {
    pending: { label: "Pending Review", class: "badge-pending", icon: "⏳", step: 1 },
    approved: { label: "Approved", class: "badge-approved", icon: "✅", step: 2 },
    rejected: { label: "Rejected", class: "badge-rejected", icon: "❌", step: 2 },
    printed: { label: "ID Printed", class: "badge-printed", icon: "🎴", step: 3 },
  };

  return (
    <>
      {/* Search Box */}
      <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Enter Application ID</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Paste your application ID here..."
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            style={{ flex: 1, fontFamily: "monospace" }}
          />
          <button onClick={() => handleTrack()} className="btn-primary" disabled={loading || !applicationId.trim()}>
            {loading ? <span className="spinner" /> : "Track"}
          </button>
        </div>
      </div>

      {error && (
        <div className="animate-fade-in" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 20, textAlign: "center", color: "#f87171" }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Application Not Found</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Please check your application ID and try again.</p>
        </div>
      )}

      {result && (
        <div className="glass-card-static animate-fade-in-up" style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{result.fullName}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{result.department}</p>
            </div>
            <span className={`badge ${statusConfig[result.status]?.class || "badge-pending"}`}>
              {statusConfig[result.status]?.icon} {statusConfig[result.status]?.label || result.status}
            </span>
          </div>

          {/* Status Timeline */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Application Progress</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {["Submitted", "Under Review", "ID Ready"].map((step, i) => {
                const currentStep = statusConfig[result.status]?.step || 0;
                const isActive = i < currentStep;
                const isCurrent = i === currentStep - 1;
                return (
                  <div key={step} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: isActive ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(51, 65, 85, 0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700,
                        border: isCurrent ? "2px solid var(--accent-light)" : "2px solid transparent",
                        boxShadow: isCurrent ? "0 0 15px var(--accent-glow)" : "none",
                      }}>
                        {isActive ? "✓" : i + 1}
                      </div>
                      <span style={{ fontSize: 12, color: isActive ? "var(--text-primary)" : "var(--text-muted)", fontWeight: isActive ? 600 : 400 }}>{step}</span>
                    </div>
                    {i < 2 && (
                      <div style={{ height: 2, flex: 1, background: isActive && i < currentStep - 1 ? "var(--accent)" : "rgba(51, 65, 85, 0.5)", marginBottom: 24 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ background: "rgba(15, 23, 42, 0.5)", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Admission No</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{result.admissionNo}</p>
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.5)", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Submitted On</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{new Date(result.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.5)", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Application ID</p>
              <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", wordBreak: "break-all" }}>{result.id}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-grid">
      <div className="bg-gradient-radial" style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid var(--glass-border)", background: "rgba(10, 14, 26, 0.8)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>ID</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>College ID Portal</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>XYZ College of Engineering</div>
            </div>
          </Link>
          <Link href="/apply" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
            Apply Now
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Track Application</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>Enter your application ID to check the current status.</p>
        </div>

        <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}><div className="spinner spinner-lg" style={{ margin: "0 auto" }} /></div>}>
          <TrackContent />
        </Suspense>
      </main>
    </div>
  );
}
