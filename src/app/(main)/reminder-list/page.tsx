"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ReminderType, RepeatType } from "@prisma/client";
import { LuPlusCircle } from "react-icons/lu";

import EditReminderModal from "@/components/main/EditReminderModal";
import Header from "@/components/main/Header";
import ReminderCard from "@/components/main/ReminderCard";
import type { ReminderItem } from "@/types/reminder";

export default function ReminderList() {
  const { isSignedIn, isLoaded } = useUser();
  const [action, setAction] = useState<"create" | "update">("create");
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(
    null
  );

  const router = useRouter();

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return;
  }

  useEffect(() => {
    async function fetchReminders() {
      try {
        const response = await fetch("/api/reminder/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ReminderItem[] = await response.json(); // Type assertion
        setReminders(data);
      } catch (error) {
        throw new Error("Failed to fetch reminders");
      }
    }

    isLoaded && fetchReminders();
  }, [isLoaded, isSignedIn, router, isOpen]);

  const handleCardClick = (reminder: ReminderItem) => {
    setSelectedReminder(reminder);
    setIsOpen(true);
    setAction("update");
  };

  return (
    <div className="flex h-full flex-col">
      <EditReminderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reminder={selectedReminder}
        action={action}
      />
      <Header
        nodeRight={
          <button
            onClick={() => {
              setIsOpen(true);
              setAction("create");
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
      <div className="flex flex-1 flex-col bg-app-white">
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
