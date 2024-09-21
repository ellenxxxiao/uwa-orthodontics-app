"use client";

import {useState } from "react";
import { ReminderType } from "@prisma/client";
import { LuPlusCircle,LuSearch } from "react-icons/lu";

import EditReminderModal from "@/components/EditReminderModal";
import Header from "@/components/Header";
import ReminderCard from "@/components/ReminderCard";
import type { ReminderItem } from "@/types/reminder";

export default function ReminderList() {
  const [isOpen, setIsOpen] = useState(false);
  // mock list of reminders
  const reminders: ReminderItem[] = [
    {
      reminderId: 1,
      patientName: "John Doe",
      startDate: "2022-10-01",
      endDate: "2022-10-31",
      intervalInDays: 7,
      reminderType: ReminderType.ALIGNER,
      description: "ReminderType.ALIGNER"
    },
    {
      reminderId: 2,
      patientName: "Ellen Xiao",
      startDate: "2022-10-01",
      endDate: "2022-10-31",
      intervalInDays: 7,
      reminderType: ReminderType.APPOINTMENT,
      description: "ReminderType.APPOINTMENT"
    }
  ];

  return (
    <div className="flex h-screen flex-col">
      <EditReminderModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Header
        type="primary"
        iconLeft={
          <LuSearch size={30} strokeWidth={1.3} className="text-primary" />
        }
        iconRight={
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
        title="Reminders"
      />
      <div className="flex flex-1 flex-col bg-base-100">
        {/* main */}
        <div className="flex flex-col gap-4 p-4">
          {reminders.map((reminder, i) => (
            <ReminderCard key={reminder.reminderId} reminder={reminder} />
          ))}
        </div>
      </div>
    </div>
  );
}
