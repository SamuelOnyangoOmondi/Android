
import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  motto: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  location: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  level_of_education: z.string().optional(),
  school_status: z.string().optional(),
  customFields: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
      type: z.string()
    })
  ).optional()
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export type CustomField = {
  id: string;
  label: string;
  value: string;
  type: string;
};
