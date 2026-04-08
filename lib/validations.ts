import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// India-specific phone validation
const phoneSchema = z.string().refine(
  (val) => {
    const phone = parsePhoneNumberFromString(val, "IN");
    return phone?.isValid() ?? false;
  },
  { message: "Please enter a valid Indian phone number" }
);

export const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const clientSignupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const onboardingBasicSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  yearsExperience: z.coerce.number().min(0).max(60).optional(),
});

export const onboardingRoleSchema = z.object({
  role: z.enum([
    "PSYCHIATRIST",
    "CLINICAL_PSYCHOLOGIST",
    "COUNSELOR",
    "THERAPIST",
    "STUDENT_TRAINEE",
  ]),
});

export const onboardingCredentialsSchema = z.object({
  rciNumber: z.string().optional(),
  nmcNumber: z.string().optional(),
});

export const onboardingSpecializationsSchema = z.object({
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  modalities: z.array(z.string()),
});

export const onboardingSupervisionSchema = z.object({
  offersSupervision: z.boolean(),
  supervisionFee: z.coerce.number().min(800).max(5000).optional(),
  supervisionModality: z.enum(["ONLINE", "IN_PERSON", "HYBRID"]).optional(),
  supervisionApproach: z.string().max(500).optional(),
  maxSuperviseesCount: z.coerce.number().min(1).max(20).optional(),
});

export const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  presentingConcern: z.string().optional(),
  referralSource: z.string().optional(),
});

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  scheduledAt: z.string().min(1, "Date and time required"),
  duration: z.coerce.number().min(15).max(180),
  sessionType: z.enum(["INITIAL_CONSULTATION", "FOLLOW_UP", "CRISIS", "ASSESSMENT", "DISCHARGE", "OTHER"]),
  modality: z.enum(["IN_PERSON", "ONLINE", "PHONE"]),
  fee: z.coerce.number().min(0).optional(),
});

export const noteSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  appointmentId: z.string().optional(),
  template: z.enum(["SOAP", "DAP", "FREE_TEXT"]),
  content: z.any(),
  tags: z.array(z.string()).optional(),
});

export const paymentSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  amount: z.coerce.number().min(1, "Amount must be at least ₹1"),
  method: z.enum(["UPI", "CASH", "BANK_TRANSFER", "CARD", "OTHER"]),
  sessionDate: z.string().optional(),
  description: z.string().optional(),
});

export const supervisionBookingSchema = z.object({
  supervisorId: z.string(),
  scheduledAt: z.string(),
  duration: z.coerce.number().min(45).max(90),
  modality: z.enum(["ONLINE", "IN_PERSON", "HYBRID"]),
  caseContext: z.string().max(1000).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type ClientSignupInput = z.infer<typeof clientSignupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type SupervisionBookingInput = z.infer<typeof supervisionBookingSchema>;
