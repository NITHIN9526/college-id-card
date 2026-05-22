import { z } from "zod";

export const studentFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  admissionNo: z
    .string()
    .min(1, "Admission number is required")
    .max(20, "Admission number must be less than 20 characters"),
  department: z.string().min(1, "Department is required"),
  semester: z.string().min(1, "Semester is required"),
  bloodGroup: z.string().optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters"),
  studentPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  parentPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  email: z.string().email("Invalid email address"),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;

export const departments = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Chemical Engineering",
  "Biomedical Engineering",
];

export const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

export const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
