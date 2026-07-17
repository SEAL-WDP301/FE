import { z } from "zod";

export const rejectRegistrationSchema = z.object({
  reason: z.string().min(1, "Select a reason"),
  note: z.string().max(500, "Note must be at most 500 characters"),
  sendNotification: z.boolean(),
  allowRegisterAgain: z.boolean(),
}).refine((value) => value.reason !== "Other" || value.note.trim().length > 0, {
  message: "A detailed note is required for Other", path: ["note"],
});

export const waitlistRegistrationSchema = z.object({
  reason: z.string().min(2, "Reason is required"),
  priority: z.enum(["Normal", "High Priority"]),
  sendNotification: z.boolean(),
});

export const notificationSchema = z.object({
  audience: z.string().min(1),
  channels: z.array(z.string()).min(1, "Select at least one channel"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message is too short"),
  schedule: z.enum(["now", "later"]),
});
