"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check on the login page to avoid redirect loop
      if (pathname === "/admin/login") {
        setIsChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // While checking, render children so pages like /admin/login can show immediately.
  if (isChecking) {
    return <>{children}</>;
  }

  // If not authenticated, still render children (pages should handle protected data);
  // the sidebar is only shown when authenticated.
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main style={{ marginLeft: 280, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
