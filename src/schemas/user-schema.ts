import * as z from "zod";

export const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  role_name: z.string().min(1, "Role is required"),
  avatar: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
