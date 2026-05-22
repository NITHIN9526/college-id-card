import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export async function POST(
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

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify/${student.id}`,
      {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 200,
      }
    );

    // Create PDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 53.98],
    });

    // Background
    pdf.setFillColor(20, 20, 40);
    pdf.rect(0, 0, 85.6, 53.98, "F");

    // College logo
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text("ID", 4, 8);

    // Photo
    if (student.photoUrl && student.photoUrl.startsWith("/")) {
      try {
        const imgRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${student.photoUrl}`);
        const blob = await imgRes.arrayBuffer();
        const base64 = Buffer.from(blob).toString('base64');
        pdf.addImage(base64, 'PNG', 4, 12, 15, 20, undefined, 'FAST');
      } catch (e) {
        // ignore
      }
    }

    const infoStartX = 22;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(student.fullName.substring(0, 20), infoStartX, 14);

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(200, 200, 200);

    pdf.text(`Adm: ${student.admissionNo}`, infoStartX, 18);
    pdf.text(`Dept: ${student.department}`, infoStartX, 21);
    pdf.text(`Sem: ${student.semester}`, infoStartX, 24);
    pdf.text(`Blood: ${student.bloodGroup || "N/A"}`, infoStartX, 27);

    if (qrCodeUrl) {
      pdf.addImage(qrCodeUrl, "PNG", 65, 14, 15, 15);
    }

    const currentYear = new Date().getFullYear();
    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Valid from: ${currentYear}`, infoStartX, 32);
    pdf.text(`Valid till: ${currentYear + 4}`, infoStartX, 35);

    pdf.setFontSize(6);
    pdf.setTextColor(100, 150, 255);
    pdf.text("XYZ College of Engineering", 4, 50);
    pdf.text(`ID: ${student.id.substring(0, 8)}...`, 65, 50);

    const buffer = pdf.output("arraybuffer");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="id-card-${student.admissionNo}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
