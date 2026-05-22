import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { studentFormSchema } from "@/lib/validators";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const data = {
      fullName: formData.get("fullName") as string,
      admissionNo: formData.get("admissionNo") as string,
      department: formData.get("department") as string,
      semester: formData.get("semester") as string,
      bloodGroup: (formData.get("bloodGroup") as string) || undefined,
      address: formData.get("address") as string,
      studentPhone: formData.get("studentPhone") as string,
      parentPhone: formData.get("parentPhone") as string,
      email: formData.get("email") as string,
    };

    // Validate
    const validated = studentFormSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // Check duplicate admission number
    const existing = await prisma.student.findUnique({
      where: { admissionNo: data.admissionNo },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An application with this admission number already exists" },
        { status: 409 }
      );
    }

    // Handle photo upload
    let photoUrl: string | null = null;
    const photo = formData.get("photo") as File | null;
    if (photo && photo.size > 0) {
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Photo must be less than 5MB" },
          { status: 400 }
        );
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          { error: "Photo must be JPEG, PNG, or WebP" },
          { status: 400 }
        );
      }

      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = photo.name.split(".").pop() || "jpg";
      const fileName = `${data.admissionNo.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.${ext}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    // Create student record
    const student = await prisma.student.create({
      data: {
        ...validated.data,
        bloodGroup: validated.data.bloodGroup || null,
        photoUrl,
      },
    });

    return NextResponse.json(
      {
        success: true,
        applicationId: student.id,
        message: "Application submitted successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
