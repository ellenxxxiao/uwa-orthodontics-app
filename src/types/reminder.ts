import type { ReminderType } from "@prisma/client";

export type ReminderItem = {
  reminderId: number;
  patientName: string;
  startDate: string;
  endDate: string;
  intervalInDays: number;
  reminderType: ReminderType;
  description: string;
};
