import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Background Glow */}
      <div className="bg-gradient-radial fixed inset-0 pointer-events-none" />

      {/* Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
          background: "rgba(10, 14, 26, 0.8)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              ID
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>College ID Portal</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                XYZ College of Engineering
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/track" className="btn-secondary" style={{ padding: "8px 20px", fontSize: 14 }}>
              Track Status
            </Link>
            <Link href="/apply" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
              Apply Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: "relative" }}>
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div className="animate-fade-in-up">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 20,
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                fontSize: 13,
                color: "var(--accent-light)",
                marginBottom: 24,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#34d399",
                  display: "inline-block",
                }}
              />{" "}
              Applications Open for 2025-26
            </div>
          </div>

          <h1
            className="animate-fade-in-up stagger-1"
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 20,
              background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Digital Student
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1, #a78bfa, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Identity Card
            </span>
          </h1>

          <p
            className="animate-fade-in-up stagger-2"
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Apply for your college ID card online. Submit your details, upload your
            photo, and track your application status — all in one place.
          </p>

          <div
            className="animate-fade-in-up stagger-3"
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/apply"
              className="btn-primary"
              style={{ padding: "16px 40px", fontSize: 16 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Apply for ID Card
            </Link>
            <Link
              href="/track"
              className="btn-secondary"
              style={{ padding: "16px 40px", fontSize: 16 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Track Application
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px 100px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "📝",
                title: "Easy Application",
                desc: "Fill out a simple form with your details and upload a passport photo. No paperwork needed.",
                delay: "stagger-1",
              },
              {
                icon: "🔍",
                title: "Real-time Tracking",
                desc: "Track your application status in real-time using your unique application ID.",
                delay: "stagger-2",
              },
              {
                icon: "🎴",
                title: "Digital ID Card",
                desc: "Get a professionally designed ID card with QR code for instant verification.",
                delay: "stagger-3",
              },
              {
                icon: "🔒",
                title: "Secure & Verified",
                desc: "Your data is securely stored. Each ID includes a QR code for authenticity verification.",
                delay: "stagger-4",
              },
              {
                icon: "⚡",
                title: "Fast Processing",
                desc: "Applications are reviewed quickly by the admin team. Get your ID card approved fast.",
                delay: "stagger-5",
              },
              {
                icon: "📱",
                title: "QR Verification",
                desc: "Scan the QR code on any ID to instantly verify student details and card validity.",
                delay: "stagger-1",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`glass-card animate-fade-in-up ${feature.delay}`}
                style={{ padding: 28 }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{feature.icon}</div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "var(--text-primary)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--glass-border)",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              © 2025 XYZ College of Engineering — Student ID Portal
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
              <Link
                href="/admin/login"
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                Admin Login
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
