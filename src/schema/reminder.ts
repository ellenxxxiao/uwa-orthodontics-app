import { z } from "zod";
import { ReminderType, RepeatType } from "@prisma/client";

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
