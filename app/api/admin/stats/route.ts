import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [total, pending, approved, rejected, printed] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: "pending" } }),
      prisma.student.count({ where: { status: "approved" } }),
      prisma.student.count({ where: { status: "rejected" } }),
      prisma.student.count({ where: { status: "printed" } }),
    ]);

    const recentApplications = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        admissionNo: true,
        department: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected,
      printed,
      recentApplications,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
