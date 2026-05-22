import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "College ID Portal - Student Identity Card Management",
  description:
    "Apply for your student identity card online. Submit your details, track your application, and get your ID card generated digitally.",
  keywords: "college, student, ID card, identity, application, portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-grid">{children}</body>
    </html>
  );
}
