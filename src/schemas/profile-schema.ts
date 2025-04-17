import * as z from "zod";

export const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    }),
  last_name: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(30, {
      message: "Last name must not be longer than 30 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  number: z
    .string()
    .regex(/^\d*$/, { message: "Contact number must contain only digits" })
    .optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  current_password: z.string().min(1, {
    message: "Current password is required to update profile.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
