import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Generate QR code data URL
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify/${student.id}`,
      {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 300,
      }
    );

    return NextResponse.json({ qrCode: qrCodeUrl });
  } catch (error) {
    console.error("QR code generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
