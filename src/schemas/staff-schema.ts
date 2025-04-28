import * as z from "zod";

export const staffSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  division_id: z.string().min(1, "Division is required"),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
