"use client";

import { useState } from "react";
import { ReminderType, RepeatType } from "@prisma/client";
import { LuPlusCircle } from "react-icons/lu";

import EditReminderModal from "@/components/main/EditReminderModal";
import Header from "@/components/main/Header";
import ReminderCard from "@/components/main/ReminderCard";
import type { ReminderItem } from "@/types/reminder";

export default function ReminderList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(
    null
  );

  // mock list of reminders
  const reminders: ReminderItem[] = [
    {
      reminderId: 1,
      patientName: "John Doe",
      startDate: "2022-10-01 11:11:00",
      endDate: "2022-10-31",
      intervalInDays: 7,
      reminderType: ReminderType.ALIGNER,
      description: "ReminderType.ALIGNER",
      repeat: RepeatType.WEEKLY
    },
    {
      reminderId: 2,
      patientName: "Ellen Xiao",
      startDate: "2022-10-01",
      intervalInDays: 7,
      reminderType: ReminderType.APPOINTMENT,
      description: "RemindesdfsfsdfsdfsdfsdfrTsdofMENT",
      repeat: RepeatType.NEVER
    }
  ];

  const handleCardClick = (reminder: ReminderItem) => {
    setSelectedReminder(reminder);
    setIsOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <EditReminderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reminder={selectedReminder}
      />
      <Header
        nodeRight={
          <button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <LuPlusCircle
              size={30}
              strokeWidth={1.3}
              className="text-primary"
            />
          </button>
        }
        nodeTitle={<span>Reminders</span>}
      />
      <div className="flex flex-1 flex-col overflow-y-auto bg-app-white">
        {/* main */}
        <div className="flex flex-col gap-4 p-4">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.reminderId}
              reminder={reminder}
              onClick={() => handleCardClick(reminder)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
