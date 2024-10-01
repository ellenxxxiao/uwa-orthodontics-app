import { ReminderType, RepeatType } from "@prisma/client";
import { z } from "zod";

// Update reminder schema
export const UpdateReminderSchema = z.object({
  setById: z.string().optional(),
  setForId: z.string().optional(),
  scheduledAt: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  reminderType: z.nativeEnum(ReminderType).optional(),
  repeatType: z.nativeEnum(RepeatType).optional(),
  intervalInDays: z.number().optional(),
  isReminderActive: z.boolean().optional()
});

// Create reminder schema
export const CreateReminderSchema = z.object({
  setById: z.string(),
  setForId: z.string(),
  scheduledAt: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  reminderType: z.nativeEnum(ReminderType),
  repeatType: z.nativeEnum(RepeatType),
  intervalInDays: z.number()
});
