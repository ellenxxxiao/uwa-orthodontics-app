/*
  Warnings:

  - You are about to drop the column `type` on the `Reminder` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('NEVER', 'DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'YEARLY', 'CUSTOM');

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "type",
ADD COLUMN     "reminderType" "ReminderType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "repeatType" "RepeatType" NOT NULL DEFAULT 'NEVER';
