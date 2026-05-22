"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentFormSchema, StudentFormData, departments, semesters, bloodGroups } from "@/lib/validators";
import Link from "next/link";

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; applicationId?: string; error?: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoFileRef = useRef<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo must be less than 5MB");
        return;
      }
      photoFileRef.current = file;
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (photoFileRef.current) {
        formData.append("photo", photoFileRef.current);
      }

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        setResult({ success: true, applicationId: json.applicationId });
      } else {
        setResult({ success: false, error: json.error || "Something went wrong" });
      }
    } catch {
      setResult({ success: false, error: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result?.success) {
    return (
      <div className="min-h-screen bg-grid" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="bg-gradient-radial" style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />
        <div className="glass-card-static animate-fade-in-up" style={{ padding: 48, maxWidth: 500, width: "100%", margin: 24, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "2px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 40 }}>
            ✓
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Application Submitted!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Your ID card application has been submitted successfully.</p>

          <div style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Your Application ID</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-light)", fontFamily: "monospace", wordBreak: "break-all" }}>
              {result.applicationId}
            </p>
          </div>

          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
            Save this ID to track your application status.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/track?id=${result.applicationId}`} className="btn-primary">
              Track Status
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <div className="bg-gradient-radial" style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />

      {/* Header */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid var(--glass-border)", background: "rgba(10, 14, 26, 0.8)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>ID</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>College ID Portal</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>XYZ College of Engineering</div>
            </div>
          </Link>
          <Link href="/track" className="btn-secondary" style={{ padding: "8px 20px", fontSize: 14 }}>
            Track Status
          </Link>
        </div>
      </nav>

      {/* Form */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            Apply for ID Card
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Fill in your details below to submit your student ID card application.
          </p>
        </div>

        {result?.error && (
          <div className="animate-fade-in" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 16, marginBottom: 24, color: "#f87171", fontSize: 14 }}>
            ⚠️ {result.error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--accent)" }}>📷</span> Photo Upload
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div className="photo-upload" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>Click to upload<br />passport photo</span>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} style={{ display: "none" }} />
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
                <p>• Passport-size photo</p>
                <p>• JPEG, PNG, or WebP</p>
                <p>• Max 5MB file size</p>
                <p>• Plain background preferred</p>
              </div>
            </div>
          </div>

          <div className="glass-card-static animate-fade-in-up stagger-2" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--accent)" }}>👤</span> Personal Details
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input {...register("fullName")} className={`form-input ${errors.fullName ? "error" : ""}`} placeholder="Enter your full name" />
                {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Admission Number *</label>
                <input {...register("admissionNo")} className={`form-input ${errors.admissionNo ? "error" : ""}`} placeholder="e.g., ADM2024001" />
                {errors.admissionNo && <span className="form-error">{errors.admissionNo.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select {...register("department")} className={`form-select ${errors.department ? "error" : ""}`}>
                  <option value="">Select department</option>
                  {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
                {errors.department && <span className="form-error">{errors.department.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Semester *</label>
                <select {...register("semester")} className={`form-select ${errors.semester ? "error" : ""}`}>
                  <option value="">Select semester</option>
                  {semesters.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                {errors.semester && <span className="form-error">{errors.semester.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select {...register("bloodGroup")} className="form-select">
                  <option value="">Select blood group</option>
                  {bloodGroups.map((b) => (<option key={b} value={b}>{b}</option>))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input {...register("email")} type="email" className={`form-input ${errors.email ? "error" : ""}`} placeholder="your@email.com" />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>
            </div>
          </div>

          <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--accent)" }}>📞</span> Contact Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Student Phone *</label>
                <input {...register("studentPhone")} className={`form-input ${errors.studentPhone ? "error" : ""}`} placeholder="+91 XXXXX XXXXX" />
                {errors.studentPhone && <span className="form-error">{errors.studentPhone.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Parent Phone *</label>
                <input {...register("parentPhone")} className={`form-input ${errors.parentPhone ? "error" : ""}`} placeholder="+91 XXXXX XXXXX" />
                {errors.parentPhone && <span className="form-error">{errors.parentPhone.message}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Address *</label>
                <textarea {...register("address")} className={`form-input ${errors.address ? "error" : ""}`} placeholder="Enter your full address" rows={3} />
                {errors.address && <span className="form-error">{errors.address.message}</span>}
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up stagger-4" style={{ display: "flex", gap: 16, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Link href="/" className="btn-secondary" style={{ padding: "14px 32px" }}>
              Cancel
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: "14px 40px", fontSize: 16 }} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
