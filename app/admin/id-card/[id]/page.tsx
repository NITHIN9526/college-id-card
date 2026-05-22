"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminIDCardPage() {
  const params = useParams();
  const id = params.id as string;

  const [student, setStudent] = useState<any>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/applications/${id}`);
        const json = await res.json();
        if (res.ok) {
          setStudent(json);
        } else {
          setError(json.error || "Failed to load student");
        }

        const qrRes = await fetch(`/api/admin/id-card/${id}/qr`);
        const qrJson = await qrRes.json();
        if (qrRes.ok) setQr(qrJson.qrCode);
      } catch (e) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/admin/id-card/${id}/pdf`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Failed to generate PDF");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `id-card-${student?.admissionNo || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Network error while generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: "#f87171" }}>{error}</div>;
  if (!student) return <div style={{ padding: 32 }}>Student not found</div>;

  return (
    <div style={{ padding: 32 }}>
      <Link href="/admin/applications" style={{ color: "var(--accent-light)", textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
        ← Back to Applications
      </Link>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 320 }}>
          <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.02)" }}>
            {student.photoUrl ? (
              <img src={student.photoUrl} alt="photo" style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 8 }} />
            ) : (
              <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(255,255,255,0.01)", color: "var(--text-muted)" }}>
                No Photo
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Admission</p>
              <p style={{ fontFamily: "monospace", fontSize: 14 }}>{student.admissionNo}</p>
            </div>
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Department</p>
              <p style={{ fontSize: 14 }}>{student.department}</p>
            </div>

            {qr && (
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <img src={qr} alt="QR" style={{ width: 140, height: 140 }} />
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>QR links to verification page</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.02)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{student.fullName}</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>{student.email}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Student Phone</p>
                <p style={{ fontSize: 14 }}>{student.studentPhone}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Parent Phone</p>
                <p style={{ fontSize: 14 }}>{student.parentPhone}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Semester</p>
                <p style={{ fontSize: 14 }}>{student.semester}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Blood Group</p>
                <p style={{ fontSize: 14 }}>{student.bloodGroup || "N/A"}</p>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Address</p>
              <p style={{ fontSize: 14 }}>{student.address}</p>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <button onClick={handleDownloadPdf} disabled={isGenerating} className="btn-primary" style={{ padding: "12px 16px", borderRadius: 8 }}>
                {isGenerating ? "Generating..." : "Download ID PDF"}
              </button>
              <Link href={`/admin/applications/${id}`} className="btn-secondary" style={{ padding: "12px 16px", borderRadius: 8 }}>
                Back to Review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
