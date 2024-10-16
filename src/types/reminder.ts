import type { ReminderType, RepeatType } from "@prisma/client";

export type ReminderItem = {
  reminderId: number;
  patientId: string;
  patientName: string;
  startDate: string;
  endDate?: string;
  intervalInDays: number;
  reminderType: ReminderType;
  description: string;
  repeatType: RepeatType;
};
